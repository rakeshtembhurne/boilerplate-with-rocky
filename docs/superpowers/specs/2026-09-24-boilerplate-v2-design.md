# Boilerplate v2 — Design Spec

Date: 2026-09-24
Branch: `feature/boilerplate-v2` (off `develop`)
Status: Approved in chat; implementation plan in `tasks/todo.md`

## 1. Goal

Turn the current scaffold into a **ship-ready Next.js 16 boilerplate** that a new
project can adopt immediately, and that runs both **self-hosted (Docker/Podman)**
and **on Vercel**, with a first-class **theming system** and **agent docs**.

Non-goal: the brandsome product features (logo maker). Those live on
`feature/logo-maker` and are out of scope here.

## 2. Starting state (verified 2026-09-24)

- `bun run build` **fails** on `feature/logo-maker` (`logo-edit-form.tsx` `asChild`).
  Baseline for this branch must be re-verified since `develop` does not contain
  the logos plugin.
- No `Containerfile`, no `.github/`, `.nvmrc` = Node 16, `middleware.ts` deprecated.
- DB is SQLite (`file:./dev.db`, committed) while README/env/compose say Postgres;
  `@prisma/client` 5.22 vs `@prisma/adapter-*` 7.x.
- Two lockfiles, 12 tracked `test-*.cjs`, dead Contentlayer, ~20 unused deps.
- `.mcp.json` contains a committed API key.
- Auth has a privilege-escalation path in `actions/update-user-role.ts`.

## 3. Target stack

| Package | From → To |
|---|---|
| next | 16.1.1 → 16.3.6 |
| react / react-dom | 19.2.6 → 19.3.0 |
| prisma / @prisma/client | 5.22 → 7.10.0 |
| @prisma/adapter-libsql | 7.8 → 7.10.0 |
| @libsql/client | 0.17.3 → 0.18.0 |
| better-auth | 1.4.10 → 1.7.5 |
| tailwindcss / @tailwindcss/postcss | 4.1.14 → 4.3.3 |
| next-themes | 0.3 → 0.4.6 |
| zod | 3.23.8 → 4.6.5 |
| @vercel/og | remove (use `next/og`) |
| vinext / vite / @vitejs/* / react-server-dom-webpack / baseline-browser-mapping | remove |
| @t3-oss/env-nextjs | remove (replace with `lib/env.ts`) |
| typescript | keep 5.9.x (TS 7 too risky for Next 16 toolchain) |

## 4. Database — Turso libSQL (Prisma 7)

- `prisma.config.ts` at root via `defineConfig({ schema, datasource: { url } })`.
- `prisma/schema.prisma`: `datasource db { provider = "sqlite" }`; generator
  `prisma-client` with explicit `output` (`prisma/generated`).
- `lib/db.ts`: `PrismaLibSQL({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN })`
  wrapped in a global singleton.
- Local dev `file:./dev.db`; production `libsql://<db>.turso.io` + auth token.
- Untrack `prisma/dev.db`; add migration + seed.
- Scripts: `db:migrate`, `db:push`, `db:studio`, `db:seed`; document remote
  Turso flow (`prisma migrate diff` + `turso db shell`).

## 5. Auth

- Env-driven `trustedOrigins`; production `baseURL` from env with a loud fallback.
- `requireEmailVerification` configurable by env.
- **Fix privilege escalation**: only ADMIN may change roles; enforce in
  `actions/update-user-role.ts`; the UI must not offer self-promotion.
- Consolidate `lib/next-auth-compat.tsx` into `lib/auth-client.ts`.
- Complete flows: reset-password + verify-email via better-auth APIs, Resend
  email with graceful no-op when `RESEND_API_KEY` is absent.

## 6. Next 16 architecture

- `middleware.ts` → `proxy.ts` (codemod or manual), Node runtime, coarse cookie
  gate only; real authz in Server Actions / route handlers.
- `eslint.config.mjs` flat config; `"lint": "eslint ."`.
- Remove redundant `--turbopack` flags.
- Adopt `cacheComponents: true` + `"use cache"` / `cacheLife` / `cacheTag`, with
  `revalidateTag` on mutations, for dashboard + items + filters.
- `next/og` route, rebranded; `generateMetadata` on key routes;
  `siteConfig.url` required-with-fallback so metadata never throws.

## 7. Theming — single source of truth

- `styles/themes.css` is authoritative; a typed preset registry (CSS selector +
  tokens + font + chips) is derived so `lib/themes.ts` / `lib/theme-fonts.ts`
  cannot drift.
- Expose all presets consistently; remove the dead `[data-theme-font]` axis in
  favour of `DynamicFontLoader`.
- Fix `active-theme.tsx` per-axis cookie bug and `sidebar.tsx` `hsl(oklch)` bug.
- Modernize `components.json` for Tailwind v4.
- Refresh TweakCN presets to their current published set and regenerate
  `themes.css`.

## 8. Plugins — one exemplar

- Delete `products` and `logos` scaffolds.
- Ship one neutral `items` plugin: CRUD route handlers, Zod validation, client +
  server API, list/create/edit pages, cache tags, dashboard nav entry.

## 9. Cleanup (aggressive / YAGNI)

Delete: 12 `test-*.cjs` + `e2e-test.cjs`; `setup.mjs` + `remove-content`;
`package-lock.json`; duplicate ignore file; Contentlayer config/content/deps/script;
dead modules (`lib/google-auth.ts`, `lib/user.ts`, `lib/fonts.ts`, TOC lib+hooks,
`date-range-picker`, `calendar`, `use-page-filters`, `config/docs.ts`,
`config/blog.ts`, `session-provider`, dead reset/verify forms, `products/_lib/cache.ts`);
`lib/logo-ai.ts` + `/api/logo*`; `Generation`/`Subscription` models; dead
`lib/utils.ts` helpers incl. the `wsrv.nl` blur call; ~20 unused deps and unused
`components/ui/*` + their Radix primitives. Fix `.nvmrc` → Node 20/22.

## 10. Deployment

- `podman/Containerfile`: multi-stage → `.next/standalone`, non-root user,
  `EXPOSE 3000`, `HEALTHCHECK` on `/api/health`.
- `podman/podman-compose.yml`: real `build:`, existing env file, SQLite volume
  (no Postgres), app healthcheck.
- Makefile fixed (`db:*` run in the app container; drop dead production targets).
- `.github/workflows/ci.yml`: install → lint → type-check → build (+ smoke e2e).
- Husky `prepare` + modern hooks.
- `.env.example` (Turso) + `.env.podman.example`; secrets removed/rotated.
- Vercel: `output: standalone` kept; documented Turso env vars.

## 11. Agent docs / "super powers"

- Refresh `CLAUDE.md`; add `AGENTS.md`; keep `.claude/skills` + commands.
- Remove stale context-mode block and the committed `.mcp.json` key.
- Document the optional global Superpowers install per harness (Claude Code,
  OpenCode) in the README.

## 12. Docs, branding, visual QA

- Full README rewrite.
- Neutral package name (default `nextjs-16-boilerplate`); rebrand stale strings.
- Visual QA of landing/auth/dashboard across light/dark and several presets.

## 13. Phases

1. Deps + framework upgrade → green build
2. Aggressive cleanup
3. DB (Turso) + auth correctness + complete flows
4. `items` plugin
5. Theming + TweakCN refresh
6. Next 16 features
7. Deployment
8. Docs + branding + visual QA
9. Verify & merge to `develop`

## 14. Definition of done

- Fresh clone + `.env.example` only: `bun install && bun run build`.
- `bun run type-check` and `bun run lint` clean.
- Container builds and `/api/health` returns 200.
- Smoke e2e passes.
- Each phase verified with evidence before the next; atomic commits; `--no-ff`
  merge to `develop`.
