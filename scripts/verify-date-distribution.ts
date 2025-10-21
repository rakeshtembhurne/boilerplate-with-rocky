import { PrismaClient } from "@prisma/client";
import { subMonths, subDays, startOfDay, format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("\n📊 Product Date Distribution Report");
  console.log("═══════════════════════════════════════════════════════\n");

  const today = new Date();

  // Get date ranges
  const ranges = [
    { label: "Today", from: startOfDay(today) },
    { label: "Last 7 Days", from: subDays(today, 7) },
    { label: "Last 14 Days", from: subDays(today, 14) },
    { label: "Last 28 Days", from: subDays(today, 28) },
    { label: "Last Month", from: subMonths(today, 1) },
    { label: "Last 2 Months", from: subMonths(today, 2) },
    { label: "Last 3 Months", from: subMonths(today, 3) },
    { label: "Last 6 Months", from: subMonths(today, 6) },
  ];

  console.log("Date Range Counts:");
  console.log("─────────────────────────────────────────────────────");

  for (const range of ranges) {
    const count = await prisma.product.count({
      where: {
        createdAt: {
          gte: range.from,
          lte: today,
        },
      },
    });

    const percentage = ((count / 200) * 100).toFixed(1);
    const bar = "█".repeat(Math.floor(count / 4)); // Visual bar chart

    console.log(
      `${range.label.padEnd(15)} │ ${String(count).padStart(3)} products (${percentage.padStart(5)}%) ${bar}`
    );
  }

  console.log("─────────────────────────────────────────────────────\n");

  // Get oldest and newest products
  const oldest = await prisma.product.findFirst({
    orderBy: { createdAt: "asc" },
    select: { name: true, createdAt: true },
  });

  const newest = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
    select: { name: true, createdAt: true },
  });

  console.log("Date Range:");
  console.log(`Oldest: ${format(oldest!.createdAt, "PPP")} - ${oldest!.name}`);
  console.log(`Newest: ${format(newest!.createdAt, "PPP")} - ${newest!.name}`);
  console.log();

  // Monthly breakdown
  console.log("Monthly Distribution:");
  console.log("─────────────────────────────────────────────────────");

  for (let i = 0; i < 6; i++) {
    const monthStart = startOfDay(subMonths(today, i + 1));
    const monthEnd = startOfDay(subMonths(today, i));

    const count = await prisma.product.count({
      where: {
        createdAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    const monthName = format(monthStart, "MMMM yyyy");
    const bar = "▓".repeat(Math.floor(count / 2));

    console.log(`${monthName.padEnd(20)} │ ${String(count).padStart(3)} products ${bar}`);
  }

  console.log("═══════════════════════════════════════════════════════\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
