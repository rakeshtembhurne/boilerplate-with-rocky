import { defineConfig } from "prisma/config";

// Bun loads `.env` files automatically, so no dotenv import is required.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    // `file:./prisma/dev.db` locally, `libsql://<db>.turso.io` in production.
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
