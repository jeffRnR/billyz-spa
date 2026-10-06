import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { normalizePhone } from "../src/lib/phone";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const phone = normalizePhone(process.env.SEED_ADMIN_PHONE ?? "");
  console.log("Normalised .env phone:", phone);

  const users = await prisma.user.findMany();
  for (const u of users) {
    console.log({
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      phoneMatches: u.phone === phone,
      passwordMatches: await bcrypt.compare(
        process.env.SEED_ADMIN_PASSWORD ?? "",
        u.passwordHash,
      ),
    });
  }
}

main().finally(() => prisma.$disconnect());