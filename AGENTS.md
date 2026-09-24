# AGENTS.md

See [CLAUDE.md](./CLAUDE.md) for the full project guide (stack, structure, Git
Flow, plugins, database, theming, commands).

## Quick facts for agents

- **Runtime/package manager:** Bun (`bun`, `bunx`). Do not use npm/yarn/npx.
- **Framework:** Next.js 16 App Router. `proxy.ts` replaces `middleware.ts`.
  `params`/`searchParams` are Promises; await them.
- **Database:** Prisma 7 + Turso/libSQL. Import the client from
  `@/prisma/generated/client`; use `@/lib/db` for the singleton. After changing
  `prisma/schema.prisma`, run `bun run db:migrate` (generates + migrates).
- **Auth:** better-auth (`lib/auth.ts`). Supports password, email OTP, and
  Google sign-in. For local OTP testing, set `EMAIL_OTP_TEST_CODE`; never use
  a fixed code in production. Enforce authorization server-side, not in the
  proxy.
- **Themes:** edit `styles/themes.css`, then `bun run themes:generate`.
- **Verify before done:** `bun test && bun run lint && bun run type-check && bun run build && bun run themes:check`.
- **Git Flow:** branch features from `develop`; merge with `--no-ff`; delete
  feature branches after merging. Create release tags on `main`, never on
  `develop`.

## Definition of done

1. `bun run lint` — 0 errors
2. `bun run type-check` — clean
3. `bun run build` — succeeds
4. Changes committed with a Google-style message and merged per Git Flow.
5. Keep `README.md` and `CLAUDE.md` accurate when setup, auth, routes, or
   release procedures change.
