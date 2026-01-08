import * as z from "zod";

// Define user role enum
const UserRoleSchema = z.enum(["USER", "ADMIN"]);

// Define userNameSchema with string type (not nullable) and constraints
export const userNameSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(32, "Name must be at most 32 characters"),
});

// Use role schema directly
export const userRoleSchema = z.object({
  role: UserRoleSchema,
});
