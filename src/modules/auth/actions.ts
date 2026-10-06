"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema, type LoginInput } from "./schema";

export async function loginAction(input: LoginInput): Promise<{ error: string } | void> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        error:
          e.type === "CredentialsSignin"
            ? "Invalid phone number or password"
            : "Something went wrong. Please try again.",
      };
    }
    throw e; // the redirect on success is thrown and must propagate
  }
}
