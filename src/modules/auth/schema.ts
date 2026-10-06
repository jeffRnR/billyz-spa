import { z } from "zod";
import { normalizePhone } from "@/lib/phone";

export const loginSchema = z.object({
  phone: z.string().transform((value, ctx) => {
    const phone = normalizePhone(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "Enter a valid Kenyan phone number" });
      return z.NEVER;
    }
    return phone;
  }),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.input<typeof loginSchema>;