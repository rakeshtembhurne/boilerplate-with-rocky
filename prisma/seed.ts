import { PrismaLibSql } from "@prisma/adapter-libsql";

import { Prisma, PrismaClient } from "@/prisma/generated/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

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

const statuses = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

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
    `High-quality ${productName.toLowerCase()} designed for ${category.toLowerCase()} enthusiasts.`,
    `Experience the best in ${category.toLowerCase()} with our ${productName.toLowerCase()}.`,
    `Upgrade your ${category.toLowerCase()} collection with this exceptional ${productName.toLowerCase()}.`,
    `Discover the perfect blend of style and functionality with our ${productName.toLowerCase()}.`,
    `Transform your ${category.toLowerCase()} experience with this innovative ${productName.toLowerCase()}.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomStock(): number {
  return Math.floor(Math.random() * 500);
}

async function main() {
  console.log("Starting seed...");

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("Cleared existing products");

  const products: Prisma.ProductCreateManyInput[] = [];

  // Generate 50 products
  const productsToGenerate = 50;

  for (let i = 0; i < productsToGenerate; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategoryList = subCategories[category as keyof typeof subCategories];
    const subCategory =
      subCategoryList[Math.floor(Math.random() * subCategoryList.length)];

    const name = generateProductName(category, i);
    const basePrice = randomPrice(10, 1000);
    const hasDiscount = Math.random() > 0.6;
    const discountedPrice = hasDiscount
      ? basePrice - randomPrice(5, Math.floor(basePrice * 0.3))
      : null;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stock = randomStock();
    const inStock = stock > 0;
    const chargeTax = Math.random() > 0.3;

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

    if ((i + 1) % 10 === 0) {
      console.log(`Generated ${i + 1} products...`);
    }
  }

  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seed completed! Created ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
