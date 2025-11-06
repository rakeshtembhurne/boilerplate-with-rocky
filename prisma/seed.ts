import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Beauty",
  "Technology",
  "Food",
  "Home Appliances",
  "Sports",
  "Books",
  "Toys",
];

const subCategories = {
  Electronics: ["Smartphones", "Laptops", "Tablets", "Cameras", "Audio"],
  Clothing: ["Men", "Women", "Kids", "Shoes", "Bags"],
  Accessories: ["Watches", "Jewelry", "Sunglasses", "Belts", "Wallets"],
  Beauty: ["Skincare", "Makeup", "Haircare", "Fragrance", "Tools"],
  Technology: ["Software", "Hardware", "Gadgets", "Accessories", "Components"],
  Food: ["Snacks", "Beverages", "Organic", "Frozen", "Canned"],
  "Home Appliances": ["Kitchen", "Cleaning", "Laundry", "Heating", "Cooling"],
  Sports: ["Fitness", "Outdoor", "Team Sports", "Water Sports", "Cycling"],
  Books: ["Fiction", "Non-Fiction", "Educational", "Comics", "Magazines"],
  Toys: ["Action Figures", "Dolls", "Educational", "Puzzles", "Games"],
};

const statuses: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

const productPrefixes = [
  "Premium",
  "Professional",
  "Deluxe",
  "Standard",
  "Basic",
  "Ultra",
  "Pro",
  "Lite",
  "Max",
  "Plus",
  "Elite",
  "Classic",
  "Modern",
  "Vintage",
  "Eco",
];

const productSuffixes = [
  "Edition",
  "Series",
  "Collection",
  "Line",
  "Range",
  "Model",
  "Version",
  "Pack",
  "Bundle",
  "Set",
];

function generateProductName(category: string, index: number): string {
  const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
  const suffix = productSuffixes[Math.floor(Math.random() * productSuffixes.length)];
  return `${prefix} ${category} ${suffix} ${index + 1}`;
}

function generateSKU(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let sku = "";
  for (let i = 0; i < 3; i++) {
    sku += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  sku += "-";
  for (let i = 0; i < 6; i++) {
    sku += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return sku;
}

function generateBarcode(): string {
  let barcode = "";
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  return barcode;
}

function generateDescription(productName: string, category: string): string {
  const descriptions = [
    `High-quality ${productName.toLowerCase()} designed for ${category.toLowerCase()} enthusiasts. Features premium materials and excellent craftsmanship.`,
    `Experience the best in ${category.toLowerCase()} with our ${productName.toLowerCase()}. Perfect for everyday use and special occasions.`,
    `Upgrade your ${category.toLowerCase()} collection with this exceptional ${productName.toLowerCase()}. Built to last and perform.`,
    `Discover the perfect blend of style and functionality with our ${productName.toLowerCase()}. Ideal for modern lifestyles.`,
    `Transform your ${category.toLowerCase()} experience with this innovative ${productName.toLowerCase()}. Trusted by professionals worldwide.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomStock(): number {
  const stockRanges = [
    { min: 0, max: 5, weight: 0.1 }, // Low stock
    { min: 6, max: 20, weight: 0.2 }, // Medium-low stock
    { min: 21, max: 100, weight: 0.4 }, // Medium stock
    { min: 101, max: 500, weight: 0.2 }, // High stock
    { min: 501, max: 1000, weight: 0.1 }, // Very high stock
  ];

  const random = Math.random();
  let cumWeight = 0;

  for (const range of stockRanges) {
    cumWeight += range.weight;
    if (random <= cumWeight) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }

  return 50; // Default
}

function generateRandomDate(): Date {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Generate random date between today and one year ago
  const randomTimestamp = oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime());
  const randomDate = new Date(randomTimestamp);

  // Set random time of day
  randomDate.setHours(Math.floor(Math.random() * 24));
  randomDate.setMinutes(Math.floor(Math.random() * 60));
  randomDate.setSeconds(Math.floor(Math.random() * 60));
  randomDate.setMilliseconds(Math.floor(Math.random() * 1000));

  return randomDate;
}

function generateSpecificDate(offsetDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);

  // Set random time of day
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  date.setMilliseconds(Math.floor(Math.random() * 1000));

  return date;
}

function generateDateForFilter(index: number, totalProducts: number): Date {
  // Ensure good distribution across filter periods
  const todayProducts = Math.floor(totalProducts * 0.05); // 5% today
  const yesterdayProducts = Math.floor(totalProducts * 0.05); // 5% yesterday
  const last7DaysProducts = Math.floor(totalProducts * 0.15); // 15% last 7 days
  const last30DaysProducts = Math.floor(totalProducts * 0.25); // 25% last 30 days
  const last90DaysProducts = Math.floor(totalProducts * 0.25); // 25% last 90 days
  const lastYearProducts = totalProducts - todayProducts - yesterdayProducts - last7DaysProducts - last30DaysProducts - last90DaysProducts; // Remaining

  if (index < todayProducts) {
    // Today's products
    return generateSpecificDate(Math.floor(Math.random() * 1)); // 0-1 days ago
  } else if (index < todayProducts + yesterdayProducts) {
    // Yesterday's products
    return generateSpecificDate(1 + Math.floor(Math.random() * 1)); // 1-2 days ago
  } else if (index < todayProducts + yesterdayProducts + last7DaysProducts) {
    // Last 7 days
    return generateSpecificDate(2 + Math.floor(Math.random() * 5)); // 2-7 days ago
  } else if (index < todayProducts + yesterdayProducts + last7DaysProducts + last30DaysProducts) {
    // Last 30 days
    return generateSpecificDate(7 + Math.floor(Math.random() * 23)); // 7-30 days ago
  } else if (index < todayProducts + yesterdayProducts + last7DaysProducts + last30DaysProducts + last90DaysProducts) {
    // Last 90 days
    return generateSpecificDate(30 + Math.floor(Math.random() * 60)); // 30-90 days ago
  } else {
    // Last year (91-365 days ago)
    return generateSpecificDate(90 + Math.floor(Math.random() * 275)); // 90-365 days ago
  }
}

function generateUpdatedDate(createdDate: Date): Date {
  // Updated date should be after created date but not too far in the future
  const maxFutureDays = 7; // Allow updates up to 7 days in the future
  const createdPlusMax = new Date(createdDate);
  createdPlusMax.setDate(createdPlusMax.getDate() + maxFutureDays);

  const randomTimestamp = createdDate.getTime() + Math.random() * (createdPlusMax.getTime() - createdDate.getTime());
  return new Date(randomTimestamp);
}

async function main() {
  console.log("Starting seed...");

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("Cleared existing products");

  const products: any[] = [];

  // Generate 200 products with dates distributed across filter periods
  const productsToGenerate = 200;

  for (let i = 0; i < productsToGenerate; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategoryList = subCategories[category];
    const subCategory =
      subCategoryList[Math.floor(Math.random() * subCategoryList.length)];

    const name = generateProductName(category, i);
    const basePrice = randomPrice(10, 1000);
    const hasDiscount = Math.random() > 0.6; // 40% chance of discount
    const discountedPrice = hasDiscount
      ? basePrice - randomPrice(5, Math.floor(basePrice * 0.3))
      : null;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stock = randomStock();
    const inStock = stock > 0;
    const chargeTax = Math.random() > 0.3; // 70% charge tax

    // Generate dates based on filter distribution
    const createdAt = generateDateForFilter(i, productsToGenerate);
    const updatedAt = generateUpdatedDate(createdAt);

    products.push({
      name,
      description: generateDescription(name, category),
      sku: generateSKU(),
      barcode: generateBarcode(),
      price: basePrice,
      discountedPrice,
      stock,
      category,
      subCategory,
      status,
      inStock,
      chargeTax,
      createdAt,
      updatedAt,
    });

    // Log progress every 50 products
    if ((i + 1) % 50 === 0) {
      console.log(`Generated ${i + 1} products...`);
    }
  }

  // Insert products in batches of 50 for better performance
  const batchSize = 50;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await prisma.product.createMany({
      data: batch,
    });
    console.log(`Inserted products ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
  }

  console.log(`Seed completed! Created ${products.length} products.`);

  // Print some statistics
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({
    where: { status: "ACTIVE" },
  });
  const draftProducts = await prisma.product.count({
    where: { status: "DRAFT" },
  });
  const archivedProducts = await prisma.product.count({
    where: { status: "ARCHIVED" },
  });

  console.log("\n📊 Database Statistics:");
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Active: ${activeProducts}`);
  console.log(`Draft: ${draftProducts}`);
  console.log(`Archived: ${archivedProducts}`);

  // Date distribution statistics
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const todayProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: today
      }
    }
  });

  const yesterdayProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: yesterday,
        lt: today
      }
    }
  });

  const last7DaysProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
        lt: yesterday
      }
    }
  });

  const last30DaysProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
        lt: sevenDaysAgo
      }
    }
  });

  const last90DaysProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: ninetyDaysAgo,
        lt: thirtyDaysAgo
      }
    }
  });

  const lastYearProducts = await prisma.product.count({
    where: {
      createdAt: {
        gte: oneYearAgo,
        lt: ninetyDaysAgo
      }
    }
  });

  console.log("\n📅 Date Distribution:");
  console.log(`Today: ${todayProducts} products`);
  console.log(`Yesterday: ${yesterdayProducts} products`);
  console.log(`Last 7 days: ${last7DaysProducts} products`);
  console.log(`Last 30 days: ${last30DaysProducts} products`);
  console.log(`Last 90 days: ${last90DaysProducts} products`);
  console.log(`Last year (90-365 days): ${lastYearProducts} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
