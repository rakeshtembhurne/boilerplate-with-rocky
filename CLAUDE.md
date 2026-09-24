# CLAUDE.md

Guidance for working in this repository.

## Project overview

A **production-ready Next.js 16 boilerplate** with a modular, plugin-style
architecture. Everything configurable lives in `config/` or environment
variables, validated in `lib/env.ts`.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 ·
Prisma 7 + Turso/libSQL · better-auth · Tailwind CSS v4 · shadcn/ui · Bun.

## Git Flow

This repo follows Git Flow:

- `main` — production, tagged releases only
- `develop` — integration branch; features branch from here
- `feature/*` — branch from `develop`, merge back with `--no-ff`
- `release/*`, `hotfix/*` — as needed

Rules: never commit directly to `main`; always pull `develop` before starting a
feature; delete feature branches after merging.

```bash
git checkout develop && git pull
git checkout -b feature/thing
# work…
git checkout develop && git merge --no-ff feature/thing
```

## Commit messages (Google style)

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`,
`revert`. Scopes: `items`, `auth`, `db`, `ui`, `api`, `config`, `theme`, `deps`.
Enforced by commitlint via `.husky/commit-msg`.

## Project structure

```
app/
├── (marketing)/            # public pages: landing, pricing
├── (protected)/            # auth-gated: dashboard, admin, items
├── api/                    # route handlers: auth, health, items, og, user
└── auth/                   # sign-in/up, forgot/reset-password, verify-email
components/                 # ui/, layout/, dashboard/, theme-customizer/, …
config/                     # site.ts, dashboard.ts, landing.ts, marketing.ts
lib/                        # auth, auth-client, db, env, email, session, themes, utils
prisma/                     # schema.prisma, migrations/, seed.ts, generated/ (gitignored)
podman/                     # Containerfile, podman-compose.yml
proxy.ts                    # Next 16 proxy (replaces middleware.ts)
```

## Plugin pattern

`app/(protected)/items` is the reference plugin — copy it for new features:

```
items/
├── _components/     # item-form.tsx, item-list.tsx ("use client")
├── _lib/
│   ├── server-api.ts  # "server-only": Prisma queries + revalidatePath
│   └── api-client.ts  # browser fetch wrapper
├── _types/          # domain types
├── _validations/    # zod schemas
├── page.tsx         # list (server component)
├── create/page.tsx
└── [id]/edit/page.tsx
```

- Route handlers: `app/api/items/route.ts`, `app/api/items/[id]/route.ts`
- Navigation: `config/dashboard.ts`
- Path alias: `@/items/*` → `app/(protected)/items/*` (tsconfig)
- API responses use the shared helpers in `lib/api-response.ts`

## Database (Prisma 7 + Turso)

Prisma 7 is ESM, uses a generated client (not `node_modules`), and requires a
driver adapter. Config lives in `prisma.config.ts`; the client is generated to
`prisma/generated` (gitignored) and imported as `@/prisma/generated/client`.

- Import: `import { prisma } from "@/lib/db"`
- Local dev: `DATABASE_URL="file:./prisma/dev.db"`
- Production: Turso `libsql://…` + `DATABASE_AUTH_TOKEN`
- `prisma generate` runs on install; `migrate dev` does **not** auto-generate in
  Prisma 7 — `bun run db:migrate` chains both.

## Auth (better-auth)

Configured in `lib/auth.ts`; client in `lib/auth-client.ts`. Sessions are
database-backed. `role` is exposed via `additionalFields` with `input: false`.
**Never** trust the proxy cookie check for authorization — enforce it inside
server actions and route handlers (see `actions/update-user-role.ts`).

## Theming

`styles/themes.css` is the single source of truth for presets. The typed
registry is generated: run `bun run themes:generate` after editing the CSS;
`bun run themes:check` fails CI when stale. Axes: preset, radius, scale, content
layout, light/dark. Default preset: `config/site.ts` → `siteConfig.theme.default`.

## Commands

```bash
bun run dev            # dev server
bun run build          # production build
bun run lint           # eslint (flat config)
bun run type-check     # tsc --noEmit
bun run themes:generate
bun run db:migrate / db:seed / db:studio / db:push
bun run podman:build / podman:up / podman:down / podman:logs
```

## Conventions & gotchas

- Next 16: `proxy.ts` (not `middleware.ts`); `next lint` is removed — use
  `eslint .`; `params`/`searchParams` are Promises and must be awaited.
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`), never
  hardcoded colors.
- Treat empty env strings as unset (`lib/env.ts` normalizes them).
- Prefer deleting dead code; keep one plugin exemplar instead of several.
- `bun` is the package manager and runtime — use `bunx`, not `npx`.
