import { PrismaClient } from "@prisma/client";
import { subMonths, subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Updating product dates to spread across last 6 months...\n");

  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);

  // Get all products
  const products = await prisma.product.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${products.length} products to update\n`);

  // Calculate date range in days
  const totalDays = Math.floor(
    (today.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Distribute products evenly across the date range
  const updates = products.map((product, index) => {
    // Calculate which day this product should be created on
    const dayOffset = Math.floor((index / products.length) * totalDays);
    const createdAt = startOfDay(subDays(today, totalDays - dayOffset));

    return prisma.product.update({
      where: { id: product.id },
      data: { createdAt },
    });
  });

  // Execute all updates
  console.log("Updating products...");
  await prisma.$transaction(updates);

  console.log("✅ All products updated!\n");

  // Show distribution
  console.log("📊 Date Distribution:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const today_count = await prisma.product.count({
    where: {
      createdAt: {
        gte: startOfDay(today),
      },
    },
  });

  const last7Days = await prisma.product.count({
    where: {
      createdAt: {
        gte: subDays(today, 7),
      },
    },
  });

  const last28Days = await prisma.product.count({
    where: {
      createdAt: {
        gte: subDays(today, 28),
      },
    },
  });

  const last3Months = await prisma.product.count({
    where: {
      createdAt: {
        gte: subMonths(today, 3),
      },
    },
  });

  const last6Months = await prisma.product.count({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
  });

  console.log(`Today:         ${today_count} products`);
  console.log(`Last 7 days:   ${last7Days} products`);
  console.log(`Last 28 days:  ${last28Days} products`);
  console.log(`Last 3 months: ${last3Months} products`);
  console.log(`Last 6 months: ${last6Months} products`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Show sample dates
  const samples = await prisma.product.findMany({
    take: 5,
    select: { name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  console.log("📅 Sample Product Dates (most recent):");
  samples.forEach((p, i) => {
    console.log(
      `${i + 1}. ${p.name.substring(0, 30).padEnd(30)} - ${p.createdAt.toLocaleDateString()}`
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
