import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Sign in | Billyz" };

export default async function LoginPage() {
  // Only bounce users who are signed in AND still active. Using requireUser()
  // here would redirect back to /login and loop for deactivated users.
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isActive: true },
    });
    if (user?.isActive) redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Billyz Executive Barbers &amp; Beauty SPA</CardTitle>
          <CardDescription>Sign in with your phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}