import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { normalizePhone } from "../src/lib/phone";

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

    const email = process.env.SEED_ADMIN_EMAIL || null;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const phone = normalizePhone(process.env.SEED_ADMIN_PHONE ?? "");
    if (!phone || !password) {
        throw new Error("Set a valid SEED_ADMIN_PHONE and SEED_ADMIN_PASSWORD");
    }

    await prisma.user.upsert({
        where: { phone },
        update: {},
        create: {
            name: "Super Admin",
            phone,
            email,
            passwordHash: await bcrypt.hash(password, 12),
            role: "SUPER_ADMIN",
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());