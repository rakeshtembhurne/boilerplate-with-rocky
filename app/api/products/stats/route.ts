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
 * Get product statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    // Calculate stats
    const totalProducts = await prisma.product.count();

    const activeProducts = await prisma.product.count({
      where: { status: "ACTIVE" },
    });

    const lowStock = await prisma.product.count({
      where: { stock: { lt: 10 } },
    });

    // Calculate total value using raw query for better performance
    const totalValueResult = await prisma.$queryRaw<Array<{ total: number }>>`
      SELECT COALESCE(SUM(CAST(price AS NUMERIC) * stock), 0) as total FROM products
    `;
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
