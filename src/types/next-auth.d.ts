import type { DefaultSession } from "next-auth";
import type { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role; branchId: string | null } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    branchId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    branchId: string | null;
  }
}