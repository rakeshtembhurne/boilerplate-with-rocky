"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { productSchema, ProductFormData } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

export async function createProduct(data: ProductFormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const validated = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        sku: validated.sku,
        barcode: validated.barcode,
        price: new Decimal(validated.price),
        discountedPrice: validated.discountedPrice
          ? new Decimal(validated.discountedPrice)
          : null,
        stock: parseInt(validated.stock, 10),
        category: validated.category,
        subCategory: validated.subCategory,
        status: validated.status,
        inStock: validated.inStock,
        chargeTax: validated.chargeTax,
      },
    });

    revalidatePath("/dashboard/products");
    return { status: "success", data: product };
  } catch (error) {
    console.error("Create product error:", error);
    return { status: "error", message: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const validated = productSchema.parse(data);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        sku: validated.sku,
        barcode: validated.barcode,
        price: new Decimal(validated.price),
        discountedPrice: validated.discountedPrice
          ? new Decimal(validated.discountedPrice)
          : null,
        stock: parseInt(validated.stock, 10),
        category: validated.category,
        subCategory: validated.subCategory,
        status: validated.status,
        inStock: validated.inStock,
        chargeTax: validated.chargeTax,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}/edit`);
    return { status: "success", data: product };
  } catch (error) {
    console.error("Update product error:", error);
    return { status: "error", message: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { status: "success" };
  } catch (error) {
    console.error("Delete product error:", error);
    return { status: "error", message: "Failed to delete product" };
  }
}

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categories?: string[];
  statuses?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

export async function getProducts(params: GetProductsParams = {}) {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      categories = [],
      statuses = [],
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom = "",
      dateTo = "",
    } = params;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categories.length > 0) {
      where.category = { in: categories };
    }

    if (statuses.length > 0) {
      where.status = { in: statuses };
    }

    if (dateFrom && dateTo) {
      where.createdAt = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: pageSize,
    });

    // Convert Decimal to string for client components
    const serializedProducts = products.map((product) => {
      const { price, discountedPrice, ...rest } = product;
      return {
        ...rest,
        price: price.toString(),
        discountedPrice: discountedPrice ? discountedPrice.toString() : null,
      };
    });

    return {
      products: serializedProducts,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Get products error:", error);
    return {
      products: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    // Convert Decimal to string for client components
    const { price, discountedPrice, ...rest } = product;
    return {
      ...rest,
      price: price.toString(),
      discountedPrice: discountedPrice ? discountedPrice.toString() : null,
    };
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}
