import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import type { Product } from "../_types";

interface GetProductsParams {
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

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Server-side function to get products
 * Used in server components and route handlers
 */
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

/**
 * Server-side function to get a single product
 */
export async function getProduct(id: string): Promise<Product | null> {
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
