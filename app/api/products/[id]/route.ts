import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/products/_validations/product";
import { Decimal } from "@prisma/client/runtime/library";
import { successResponse, ErrorResponses } from "@/products/_lib/api-response";

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return ErrorResponses.notFound("Product not found");
    }

    // Convert Decimal to string
    const { price, discountedPrice, ...rest } = product;
    const serializedProduct = {
      ...rest,
      price: price.toString(),
      discountedPrice: discountedPrice ? discountedPrice.toString() : null,
    };

    return successResponse(serializedProduct, {
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.error("Get product error:", error);
    return ErrorResponses.internalError("Failed to fetch product");
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const { id } = await params;
    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return ErrorResponses.validationError(result.error.errors);
    }

    const validated = result.data;

    try {
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

      // Convert Decimal to string
      const { price, discountedPrice, ...rest } = product;
      const serializedProduct = {
        ...rest,
        price: price.toString(),
        discountedPrice: discountedPrice ? discountedPrice.toString() : null,
      };

      return successResponse(serializedProduct, {
        message: "Product updated successfully",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return ErrorResponses.notFound("Product not found");
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Update product error:", error);
    return ErrorResponses.internalError("Failed to update product");
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return ErrorResponses.unauthorized();
    }

    const { id } = await params;

    try {
      await prisma.product.delete({
        where: { id },
      });

      return successResponse(null, {
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return ErrorResponses.notFound("Product not found");
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Delete product error:", error);
    return ErrorResponses.internalError("Failed to delete product");
  }
}
