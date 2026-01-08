import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { UserRole } from "@prisma/client"

import { prisma } from "@/lib/db"
import { env } from "@/env.mjs"

export const auth = betterAuth({
  // Set base URL - in development, allow dynamic detection
  baseURL: process.env.NODE_ENV === "production"
    ? env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    transaction: true, // Enable transactions for proper state management
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    sendResetPassword: async ({ user, url }) => {
      if (!process.env.RESEND_API_KEY) {
        console.log("Password reset requested:", { user, url })
        return
      }

      try {
        const resend = require('resend')
        const resendInstance = new resend.RESEND(process.env.RESEND_API_KEY)

        await resendInstance.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourapp.com',
          to: user.email,
          subject: 'Reset your password',
          html: `
            <p>Hello ${user.name || 'User'},</p>
            <p>We received a request to reset the password for your account. Click the link below to create a new password:</p>
            <p><a href="${url}">Reset Password</a></p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          `,
        })
      } catch (error) {
        console.error("Failed to send reset password email:", error)
      }
    },
    sendVerificationEmail: async ({ user, url }) => {
      if (!process.env.RESEND_API_KEY) {
        console.log("Verification email:", { user, url })
        return
      }

      try {
        const resend = require('resend')
        const resendInstance = new resend.RESEND(process.env.RESEND_API_KEY)

        await resendInstance.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourapp.com',
          to: user.email,
          subject: 'Verify your email address',
          html: `
            <p>Hello ${user.name || 'User'},</p>
            <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
            <p><a href="${url}">Verify Email</a></p>
            <p>This link will expire in 24 hours for security reasons.</p>
          `,
        })
      } catch (error) {
        console.error("Failed to send verification email:", error)
      }
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"] as const,
        required: false,
        defaultValue: "USER" as const,
        input: false, // Don't allow users to set their own role
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    // Use database session strategy for better OAuth state management
    strategy: "database",
  },
  // Add PKCE for better security
  pkce: {
    enabled: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Disabled to avoid conflicts
    },
    cookiePrefix: "auth",
    // Use sameSite for better compatibility
    cookies: {
      sessionToken: {
        name: "auth-session",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      state: {
        name: "auth-state",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
    // Allow any localhost origin in development for dynamic ports
    trustedOrigins: process.env.NODE_ENV === "production"
      ? [env.NEXT_PUBLIC_APP_URL]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

// Type exports for TypeScript
export type Session = typeof auth.$Infer.Session
