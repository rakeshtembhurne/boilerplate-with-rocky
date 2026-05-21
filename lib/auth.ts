import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "@/lib/db"
import { env } from "@/env.mjs"

// Helper to get base URL
function getBaseURL() {
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL
  }
  // In development, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }
  // Fallback for production without explicit URL
  return "http://localhost:3000"
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for easier testing
  },
  socialProviders: {
    google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    } : undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false, // Disable cache in development to avoid stale data
      maxAge: 5 * 60, // 5 minutes
    },
    strategy: "database",
  },
  advanced: {
    cookiePrefix: "brandsome",
    trustedOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
  },
})

// Type exports for TypeScript
export type Session = typeof auth.$Infer.Session
