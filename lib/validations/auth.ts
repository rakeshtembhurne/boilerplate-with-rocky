import * as z from "zod"

// Sign up schema - includes name, email and password
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Sign in schema - only email and password
export const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, "Password is required"),
})

// Legacy auth schema (for backward compatibility)
export const userAuthSchema = signUpSchema
