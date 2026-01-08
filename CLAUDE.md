# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16** enterprise-grade boilerplate with configurable architecture, supporting content management, user authentication, role-based authorization, and containerization with Podman.

**Key Philosophy:** Everything is configurable through environment variables with type-safe validation.

## Development Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Development with Turbopack (faster)
bun run turbo

# Build production
bun run build

# Start production server
bun start

# Linting
bun run lint

# Format code
bun run format

# Type checking
bun run type-check

# Preview production build locally
bun run preview

# Generate Prisma client (with Zod schemas)
bun run postinstall

# Database operations
bun run db:migrate    # Run migrations
bun run db:studio    # Open Prisma Studio
bun run db:seed      # Seed database
bun run db:reset     # Reset database (dev only)

# Email development server
bun run email

# Podman commands
bun run podman:up      # Start containers
bun run podman:down    # Stop containers
bun run podman:build   # Build containers
bun run podman:logs    # View logs

# Remove content sections
bun run remove-content --blog
bun run remove-content --docs
```

## Project Structure

### Key Directories

- **`app/`** – Next.js 16 App Router:
  - `(marketing)/` – Public pages, blog, documentation
  - `(protected)/` – Dashboard and admin pages with authentication
  - `api/` – API routes and webhooks

- **`config/`** – Centralized configuration:
  - `site.ts` – Site metadata and global settings
  - `dashboard.ts` – Navigation with role-based access
  - `features.ts` – Feature flags

- **`lib/`** – Core utilities:
  - `db.ts` – Prisma client with Zod integration
  - `auth.ts` – betterAuth configuration
  - `session.ts` – Session management
  - `utils.ts` – General utilities
  - `validations/` – Zod schemas (auto-generated)

- **`components/`** – Reusable React components:
  - `ui/` – shadcn/ui v2 components
  - `dashboard/` – Dashboard-specific components
  - `docs/` – Documentation UI components
  - `layout/` – Layout components
  - `forms/` – Form components with validation

- **`actions/`** – Server actions for form submissions
- **`emails/`** – React Email templates
- **`content/`** – MDX content for blog/docs
- **`podman/`** – Container configuration files

## Tech Stack

- **Runtime:** Bun 2.x
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.9+
- **React:** React 19
- **Database:** PostgreSQL 18+
- **ORM:** Prisma 7+ with Zod schemas
- **Auth:** betterAuth with OAuth
- **UI:** Tailwind CSS 4.x + shadcn/ui v2
- **Container:** Podman 5.x

## Key Conventions

### 1. Route Groups
- Public routes: `(marketing)/`
- Protected routes: `(protected)/`
- API routes: `api/`

### 2. Async Parameters
Always await `params` and `searchParams` in pages:
```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // ...
}
```

### 3. Components
- Use Server Components by default
- Add `"use client"` only when interactive features are needed
- UI components go in `components/ui/`
- Feature-specific components in `components/{feature}/`

### 4. Database Changes
1. Update `prisma/schema.prisma`
2. Run `bun run db:migrate`
3. Run `bun run postinstall` to regenerate Prisma client
4. Use Zod schemas in `lib/validations/` for form validation

### 5. Forms
- Use React Hook Form with Zod validation
- Server actions for form submissions
- Import validation schemas from `lib/validations/index.ts`
- Use `schema.safeParse()` in Server Actions for validation

### 6. Authentication
- Configured in `lib/auth.ts`
- Role-based access control (`ADMIN` | `USER`)
- Middleware for route protection

### 7. Environment Variables
- Validate in `env.mjs` using @t3-oss/env-nextjs
- Server variables use `env.*` (no `NEXT_PUBLIC_`)
- Client variables use `env.NEXT_PUBLIC_*`
- Add new vars to `.env.example`

### 8. Styling
- Tailwind CSS 4.x with custom theme
- Components use Tailwind classes directly
- No CSS modules or global styles

## Important Notes

- Always await `params` and `searchParams` (they're Promises)
- Use Zod schemas from `lib/validations/` for form validation
- Prisma client is used directly for database operations
- Server actions handle form submissions and mutations
- Containerization uses Podman (not Docker)
- Bun is the preferred runtime and package manager
- Everything is configurable through environment variables

## File Locations

- Prisma schema: `prisma/schema.prisma`
- Auth config: `lib/auth.ts`
- Environment validation: `env.mjs`
- Site config: `config/site.ts`
- Container config: `podman/`