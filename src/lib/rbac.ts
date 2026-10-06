import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do this") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
  branchId: string | null;
};

// Verifies the session AND re-checks the DB, so deactivated users and
// role/branch changes take effect immediately, not at token expiry.
export const requireUser = cache(async (): Promise<AuthUser> => {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, branchId: true, isActive: true },
  });
  if (!user || !user.isActive) redirect("/login");

  return { id: user.id, name: user.name, role: user.role, branchId: user.branchId };
});

export async function requireRole(...roles: Role[]): Promise<AuthUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError();
  return user;
}

// Prisma `where` fragment. Non-admins are always pinned to their own branch;
// a requested branch is honoured only for SUPER_ADMIN.
export function branchScope(
  user: AuthUser,
  requestedBranchId?: string | null,
): { branchId?: string } {
  if (user.role === "SUPER_ADMIN") {
    return requestedBranchId ? { branchId: requestedBranchId } : {};
  }
  if (!user.branchId) {
    throw new ForbiddenError("Your account is not assigned to a branch");
  }
  return { branchId: user.branchId };
}

// Use on writes and on fetch-by-id, where a raw id arrives from the client.
export function assertBranchAccess(user: AuthUser, branchId: string): void {
  if (user.role !== "SUPER_ADMIN" && user.branchId !== branchId) {
    throw new ForbiddenError();
  }
}