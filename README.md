# Acme — Next.js 16 Boilerplate

A production-ready starter built on **Next.js 16**, **React 19**, **Prisma 7 +
Turso (libSQL)**, **better-auth**, and **Tailwind v4** with a full theme system.

It runs both **self-hosted (Docker/Podman)** and on **Vercel**, ships with
type-safe environment validation, CI, and one clean plugin example to copy.

## Features

- ⚡ **Next.js 16** App Router + Turbopack, React 19
- 🔐 **better-auth** — email/password, email-code (OTP), and Google OAuth,
  email verification and password reset
- 👥 Role-based access (`ADMIN` / `USER`) with admin-only mutations
- 🗄️ **Prisma 7** + **Turso/libSQL** via the `@prisma/adapter-libsql` driver
  adapter (local SQLite file for dev, Turso for production)
- 🎨 **Tailwind CSS v4** + shadcn/ui + a 62-preset theme system
- 🧩 **Items plugin** — a complete CRUD exemplar to copy for new features
- ⚙️ Type-safe env validation (`lib/env.ts`) that fails fast in production
- 🐳 Multi-stage **Containerfile** (Docker + Podman), CI workflow, husky hooks

## Requirements

- [Bun](https://bun.sh) 1.4+
- Node.js 20.19+ (22 recommended) — only needed for tooling
- Docker or Podman (optional, for self-hosting)

## Quick start

```bash
bun install
cp .env.example .env.local      # then fill in BETTER_AUTH_SECRET etc.
bunx --bun prisma migrate dev   # creates prisma/dev.db and applies migrations
bunx --bun prisma db seed       # optional sample data
bun run dev                     # http://localhost:3000
```

## New contributor start here

1. Read this README, then [CLAUDE.md](./CLAUDE.md) for project conventions.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Use Bun for every package/runtime command; do not use npm, yarn, or npx.
4. Run the checks before opening a pull request:

```bash
bun test && bun run lint && bun run type-check && bun run build && bun run themes:check
```

Authentication is available through **Email code**, **Password**, and **Google**
sign-in modes. In local development, set `EMAIL_OTP_TEST_CODE` in `.env.local`
to use a deterministic six-digit code. The helper is ignored in production;
never commit a real OTP or rely on a fixed production code.

> Bun loads `.env` files automatically, so no `dotenv` is required.

## Scripts

| Script                                                               | Description                       |
| -------------------------------------------------------------------- | --------------------------------- |
| `bun run dev`                                                        | Dev server (Turbopack)            |
| `bun run build` / `bun run start`                                    | Production build / server         |
| `bun test`                                                           | Bun test suite                    |
| `bun run lint`                                                       | ESLint (flat config)              |
| `bun run type-check`                                                 | TypeScript                        |
| `bun run themes:generate` / `themes:check`                           | Regenerate / verify theme presets |
| `bun run db:migrate` / `db:seed` / `db:studio` / `db:push`           | Database tasks                    |
| `bun run podman:build` / `podman:up` / `podman:down` / `podman:logs` | Self-host stack                   |

## Database — Turso (libSQL)

Local development uses a SQLite file (`file:./prisma/dev.db`). Production
targets [Turso](https://turso.tech).

```bash
turso db create my-app
turso db show my-app --url          # libsql://<db>.turso.io
turso db tokens create my-app       # DATABASE_AUTH_TOKEN
```

Set:

```env
DATABASE_URL="libsql://<db>.turso.io"
DATABASE_AUTH_TOKEN="<token>"
```

Apply the schema to Turso from your machine (Prisma CLI uses `prisma.config.ts`):

```bash
bunx --bun prisma migrate deploy
bunx --bun prisma db seed
```

## Environment

See `.env.example`. Only `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_SECRET` are
enforced in production; everything else is optional and validated in
`lib/env.ts`.

| Variable                                    | Required   | Notes                                                                         |
| ------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                       | prod       | Public app URL, no trailing slash                                             |
| `BETTER_AUTH_SECRET`                        | prod       | `openssl rand -base64 32`                                                     |
| `DATABASE_URL`                              | yes        | `file:./prisma/dev.db` or `libsql://…`                                        |
| `DATABASE_AUTH_TOKEN`                       | Turso      | Turso auth token                                                              |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | no         | Enables Google OAuth                                                          |
| `RESEND_API_KEY` / `FROM_EMAIL`             | no         | Verification/reset emails (no-op without key)                                 |
| `EMAIL_OTP_TEST_CODE`                       | local only | Deterministic 6-digit code for local email OTP testing; ignored in production |
| `BETTER_AUTH_TRUSTED_ORIGINS`               | no         | Extra comma-separated origins                                                 |

## Git Flow and releases

This repository uses Git Flow:

- `develop` is the integration branch.
- Create `feature/*` branches from `develop` and merge them back with
  `--no-ff`.
- Create `release/*` branches from `develop` for release preparation.
- `main` is production-only and receives the release merge.
- Create the annotated SemVer tag on `main` **after** the release merge; never
  tag `develop`.

For a release:

```bash
git switch develop
git pull --ff-only
git switch -c release/2.0.0
bun test && bun run lint && bun run type-check && bun run build && bun run themes:check
git switch main
git pull --ff-only
git merge --no-ff release/2.0.0 -m "chore(release): release 2.0.0"
git tag -a v2.0.0 -m "Release v2.0.0"
git push origin main v2.0.0
git push origin develop
git branch -d release/2.0.0
```

Use the version in `package.json` as the release version and bump it as part of
release preparation. For a hotfix, branch from `main`, merge it into both
`main` and `develop`, and tag the production merge on `main`.

## Self-hosting (Docker / Podman)

```bash
cp .env.podman.example .env.podman   # then edit
bun run podman:build
bun run podman:up
```

The container builds a Next.js **standalone** image (multi-stage, non-root,
healthcheck on `/api/health`). Configure `DATABASE_URL` to your Turso database
(or a mounted SQLite file).

## Deploying to Vercel

1. Import the repo into Vercel.
2. Add the environment variables from `.env.example`.
3. Set `DATABASE_URL` to your Turso `libsql://` URL and add
   `DATABASE_AUTH_TOKEN`.
4. Run migrations from your machine: `bunx --bun prisma migrate deploy`.

## Project structure

```
app/
├── (marketing)/         # Public landing + pricing
├── (protected)/         # Auth-gated: dashboard, admin, items
│   ├── dashboard/
│   ├── admin/
│   └── items/           # ← the plugin exemplar (copy this)
├── api/                 # Route handlers (auth, health, items, og, user)
└── auth/                # sign-in, sign-up, forgot/reset-password, verify-email
components/              # ui/, layout/, dashboard/, theme-customizer/, …
config/                  # site, dashboard, landing, marketing
lib/                     # auth, db, env, email, themes, utils
prisma/                  # schema, migrations, seed
podman/                  # Containerfile + compose
proxy.ts                 # Next 16 proxy (formerly middleware)
```

## Plugins

`app/(protected)/items` is the reference plugin. Copy it as the skeleton for a
new feature:

```
items/
├── _components/     # item-form.tsx, item-list.tsx
├── _lib/            # server-api.ts (data), api-client.ts (browser)
├── _types/          # domain types
├── _validations/    # zod schemas
├── page.tsx         # list (server component)
├── create/page.tsx
└── [id]/edit/page.tsx
```

Route handlers live in `app/api/items`. Add the nav entry in
`config/dashboard.ts`.

## Theming

All selectable presets live in `styles/themes.css`. The typed registry
`lib/theme-presets.generated.ts` is **generated** from it:

```bash
bun run themes:generate
bun run themes:check   # CI fails if the registry is stale
```

Theme axes: preset (62), radius, scale, content layout, and light/dark. Set the
default in `config/site.ts` (`siteConfig.theme.default`).

## License

MIT — see [LICENSE.md](./LICENSE.md).
