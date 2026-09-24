import { z } from "zod";

/**
 * Type-safe environment variables.
 *
 * Values that are safe to default locally have defaults so a fresh clone builds
 * with only `.env.example`. Secrets stay optional here and are asserted in
 * production via `assertServerEnv()` from server entrypoints.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Public
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GA_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),

  // Database (Turso libSQL, or a local SQLite file)
  DATABASE_URL: z.string().min(1).default("file:./prisma/dev.db"),
  DATABASE_AUTH_TOKEN: z.string().min(1).optional(),

  // Auth (better-auth)
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  // Email
  RESEND_API_KEY: z.string().min(1).optional(),
  FROM_EMAIL: z.string().email().optional(),
  REQUIRE_EMAIL_VERIFICATION: z.enum(["true", "false"]).optional(),

  // AI providers
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  OPENROUTER_BASE_URL: z.string().url().optional(),
  OPENROUTER_MODEL: z.string().min(1).optional(),
  INFERENCE_SH_API_KEY: z.string().min(1).optional(),
  INFERENCE_SH_URL: z.string().url().optional(),
  AI_PROVIDER: z.enum(["openrouter", "inference"]).optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
});

// Treat empty strings as unset so optional vars behave as optional.
const rawEnv = Object.fromEntries(
  Object.entries(process.env).map(([key, value]) => [
    key,
    value === "" ? undefined : value,
  ]),
);

const parsed = envSchema.safeParse(rawEnv);

// `next build` must succeed without secrets; runtime validation still applies.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!parsed.success && !isBuildPhase) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${details}`);
}

export const env = (
  parsed.success ? parsed.data : envSchema.partial().parse(rawEnv)
) as z.infer<typeof envSchema>;

/** Fail loudly when production-critical secrets are missing. */
export function assertServerEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const missing = ["BETTER_AUTH_SECRET", "NEXT_PUBLIC_APP_URL"].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
