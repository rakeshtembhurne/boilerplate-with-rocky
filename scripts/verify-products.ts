import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.product.count();
  const active = await prisma.product.count({ where: { status: "ACTIVE" } });
  const draft = await prisma.product.count({ where: { status: "DRAFT" } });
  const archived = await prisma.product.count({ where: { status: "ARCHIVED" } });

  console.log("\n✅ Database Verification:");
  console.log("========================");
  console.log(`Total Products: ${total}`);
  console.log(`Active: ${active}`);
  console.log(`Draft: ${draft}`);
  console.log(`Archived: ${archived}`);
  console.log("\n📋 Sample Products:");

  const samples = await prisma.product.findMany({
    take: 5,
    select: { name: true, category: true, price: true, status: true }
  });

  samples.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - ${p.category} - $${p.price} (${p.status})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
