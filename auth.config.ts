import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

// Note: Email provider (Resend) removed from here because:
// - This config is used in middleware which runs in Edge Runtime
// - Email providers require database adapter (Prisma)
// - Prisma cannot be imported in Edge Runtime
// If you need email magic links, you'll need to configure them differently

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
