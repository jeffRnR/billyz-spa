import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  for (const b of [
    { name: "Kerugoya", code: "KRG" },
    { name: "Ruai", code: "RUA" },
  ]) {
    await prisma.branch.upsert({ where: { code: b.code }, update: {}, create: b });
  }

  for (const name of ["Kinyozi", "Salon", "SPA"]) {
    await prisma.serviceCategory.upsert({ where: { name }, update: {}, create: { name } });
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD");

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "SUPER_ADMIN",
    },
  });
}

main().finally(() => prisma.$disconnect());