import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { successResponse, ErrorResponses } from "@/products/_lib/api-response";

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  totalValue: number;
}

/**
 * GET /api/products/stats
 * Get product statistics with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    // Build where clause for filtering
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

    // Calculate stats with filters applied
    const totalProducts = await prisma.product.count({ where });

    const activeProducts = await prisma.product.count({
      where: { ...where, status: "ACTIVE" },
    });

    const lowStock = await prisma.product.count({
      where: { ...where, stock: { lt: 10 } },
    });

    // Calculate total value using raw query with filters for better performance
    let totalValueQuery = `
      SELECT COALESCE(SUM(CAST(price AS NUMERIC) * stock), 0) as total FROM products
    `;

    const queryParams: any[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push(`(
        name ILIKE $${queryParams.length + 1} OR
        sku ILIKE $${queryParams.length + 1} OR
        description ILIKE $${queryParams.length + 1}
      )`);
      queryParams.push(`%${search}%`);
    }

    if (categories.length > 0) {
      conditions.push(`category = ANY($${queryParams.length + 1})`);
      queryParams.push(categories);
    }

    if (statuses.length > 0) {
      const statusPlaceholders = statuses.map((_, index) => `$${queryParams.length + index + 1}::"ProductStatus"`).join(', ');
      conditions.push(`status IN (${statusPlaceholders})`);
      queryParams.push(...statuses);
    }

    if (dateFrom && dateTo) {
      conditions.push(`"created_at" >= $${queryParams.length + 1} AND "created_at" <= $${queryParams.length + 2}`);
      queryParams.push(new Date(dateFrom), new Date(dateTo));
    }

    if (conditions.length > 0) {
      totalValueQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    const totalValueResult = await prisma.$queryRawUnsafe<Array<{ total: number }>>(
      totalValueQuery,
      ...queryParams
    );
    const totalValue = Number(totalValueResult[0]?.total || 0);

    const stats: ProductStats = {
      totalProducts,
      activeProducts,
      lowStock,
      totalValue,
    };

    return successResponse(stats, {
      message: "Product stats fetched successfully",
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    return ErrorResponses.internalError("Failed to fetch product stats");
  }
}
