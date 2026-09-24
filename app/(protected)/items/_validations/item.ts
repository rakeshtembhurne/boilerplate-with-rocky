import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  price: z.number().min(0, "Price must be 0 or more"),
  quantity: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ItemInput = z.infer<typeof itemSchema>;
