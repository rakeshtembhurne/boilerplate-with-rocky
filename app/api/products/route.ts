import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { productSchema } from "@/products/_validations/product";
import { Prisma } from "@prisma/client";
import { successResponse, ErrorResponses } from "@/products/_lib/api-response";

// GET /api/products - Get all products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

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

    return successResponse(serializedProducts, {
      message: "Products fetched successfully",
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return ErrorResponses.internalError("Failed to fetch products");
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return ErrorResponses.validationError(result.error.errors);
    }

    const validated = result.data;

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        sku: validated.sku,
        barcode: validated.barcode,
        price: new Prisma.Decimal(validated.price),
        discountedPrice: validated.discountedPrice
          ? new Prisma.Decimal(validated.discountedPrice)
          : null,
        stock: parseInt(validated.stock, 10),
        category: validated.category,
        subCategory: validated.subCategory,
        status: validated.status,
        inStock: validated.inStock,
        chargeTax: validated.chargeTax,
      },
    });

    // Convert Decimal to string
    const { price, discountedPrice, ...rest } = product;
    const serializedProduct = {
      ...rest,
      price: price.toString(),
      discountedPrice: discountedPrice ? discountedPrice.toString() : null,
    };

    return successResponse(serializedProduct, {
      message: "Product created successfully",
      status: 201,
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    return ErrorResponses.internalError("Failed to create product");
  }
}
