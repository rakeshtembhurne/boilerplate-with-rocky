import { z } from "zod";

// User validation schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50).nullable(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().url().nullable(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateUserSchema = UserSchema.partial().extend({
  id: z.string(),
});

// Product validation schema
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(5000).nullable(),
  sku: z.string().max(50).nullable(),
  barcode: z.string().max(50).nullable(),
  price: z.number().min(0),
  discountedPrice: z.number().min(0).nullable(),
  stock: z.number().int().min(0).default(0),
  category: z.string().max(50).nullable(),
  subCategory: z.string().max(50).nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  inStock: z.boolean().default(true),
  chargeTax: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateProductSchema = ProductSchema.partial().extend({
  id: z.string(),
});
