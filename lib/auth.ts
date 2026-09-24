import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/db";
import { sendEmail, resetPasswordEmail, verifyEmailTemplate } from "@/lib/email";
import { assertServerEnv, env } from "@/lib/env";

assertServerEnv();

const appUrl = env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL;

const trustedOrigins = [
  env.NEXT_PUBLIC_APP_URL,
  env.BETTER_AUTH_URL,
  ...(env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((o) => o.trim()) ?? []),
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  baseURL: appUrl,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    // Require verification in production only when email delivery is configured.
    requireEmailVerification: env.NODE_ENV === "production" && !!env.RESEND_API_KEY,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: resetPasswordEmail(url),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: verifyEmailTemplate(url),
      });
    },
  },
  user: {
    additionalFields: {
      // Exposed on the session; `input: false` blocks clients from setting it.
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  socialProviders: {
    google:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60,
    },
    strategy: "database",
  },
  advanced: {
    cookiePrefix: "nextjs-boilerplate",
    trustedOrigins,
  },
});

export type Session = typeof auth.$Infer.Session;
