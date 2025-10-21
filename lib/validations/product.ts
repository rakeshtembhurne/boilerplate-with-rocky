import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  discountedPrice: z.string().optional(),
  stock: z.string().default("0"),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  inStock: z.boolean().default(true),
  chargeTax: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
