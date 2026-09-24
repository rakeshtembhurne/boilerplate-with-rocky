import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "@/prisma/generated/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

const statuses = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
const names = [
  "Aurora Lamp",
  "Basalt Mug",
  "Cobalt Notebook",
  "Drift Backpack",
  "Ember Kettle",
  "Fjord Chair",
  "Granite Tray",
  "Halo Speaker",
];

async function main() {
  console.log("Starting seed...");

  await prisma.item.deleteMany({});

  const items = Array.from({ length: 24 }, (_, i) => {
    const name = `${names[i % names.length]} ${i + 1}`;
    return {
      name,
      description: `Sample item generated for development (#${i + 1}).`,
      status: statuses[i % statuses.length],
      price: Math.round((15 + Math.random() * 485) * 100) / 100,
      quantity: Math.floor(Math.random() * 100),
    };
  });

  const { count } = await prisma.item.createMany({ data: items });

  console.log(`Seed completed! Created ${count} items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
