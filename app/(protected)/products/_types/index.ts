import { Product as PrismaProduct } from "@prisma/client";

// Serialized Product type for client components (Decimal -> string)
export type Product = Omit<PrismaProduct, "price" | "discountedPrice"> & {
  price: string;
  discountedPrice: string | null;
};
