import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import { prisma } from "@/lib/db";
import {
  resetPasswordEmail,
  sendEmail,
  verifyEmailTemplate,
} from "@/lib/email";
import { getDevelopmentOtpCode } from "@/lib/email-otp";
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
    // Off by default; enable with REQUIRE_EMAIL_VERIFICATION=true.
    requireEmailVerification: env.REQUIRE_EMAIL_VERIFICATION === "true",
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
  plugins: [
    emailOTP({
      generateOTP: () =>
        getDevelopmentOtpCode(env.NODE_ENV, env.EMAIL_OTP_TEST_CODE),
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (env.NODE_ENV !== "production") {
          console.info(`[auth] ${type} OTP for ${email}: ${otp}`);
        }

        await sendEmail({
          to: email,
          subject: "Your sign-in code",
          html: `<p>Use this code to sign in:</p><p><strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`,
        });
      },
    }),
  ],
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
