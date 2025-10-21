import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { successResponse, ErrorResponses } from "@/products/_lib/api-response";
import { withCache } from "@/products/_lib/cache";

export interface ProductFilters {
  categories: string[];
  statuses: Array<{ value: string; label: string }>;
}

/**
 * GET /api/products/filters
 * Fetch available filter options from database
 * Cached for 5 minutes
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    // Use cache with 5 minute TTL
    const filters = await withCache<ProductFilters>(
      "product-filters",
      300 // 5 minutes
    )(async () => {
      // Fetch distinct categories from database
      const categoriesResult = await prisma.product.findMany({
        select: { category: true },
        where: { category: { not: null } },
        distinct: ["category"],
        orderBy: { category: "asc" },
      });

      const categories = categoriesResult
        .map((p) => p.category)
        .filter((c): c is string => c !== null);

      // Fetch distinct statuses from database
      const statusesResult = await prisma.product.findMany({
        select: { status: true },
        distinct: ["status"],
        orderBy: { status: "asc" },
      });

      // Map statuses to label format
      const statuses = statusesResult.map((p) => ({
        value: p.status,
        label: p.status.charAt(0) + p.status.slice(1).toLowerCase(),
      }));

      return {
        categories,
        statuses,
      };
    });

    return successResponse(filters, {
      message: "Filters fetched successfully",
    });
  } catch (error) {
    console.error("Get filters error:", error);
    return ErrorResponses.internalError("Failed to fetch filters");
  }
}
