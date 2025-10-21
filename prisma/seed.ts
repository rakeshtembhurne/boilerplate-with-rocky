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

async function main() {
  console.log("Starting seed...");

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("Cleared existing products");

  const products: any[] = [];

  // Generate 200 products
  for (let i = 0; i < 200; i++) {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
