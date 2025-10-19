# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 AI starter boilerplate with user authentication, role-based authorization, and multi-section content management (blog, docs, dashboard). The project is **fully configurable** through environment variables and designed to be easily customizable for new projects.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Development with Turbopack (faster)
pnpm run turbo

# Build production
pnpm build

# Start production server
pnpm start

# Linting
pnpm run lint

# Preview production build locally
pnpm run preview

# Generate Prisma client
pnpm run postinstall

# Email development server (React Email)
pnpm run email

# Remove blog/docs sections
pnpm run remove-content
pnpm run remove-content --blog
pnpm run remove-content --docs
```

## Project Architecture

### Key Directories

- **`app/`** – Next.js 14 App Router with route groups:
  - `(marketing)/` – Public landing pages, blog, and documentation
  - `(protected)/` – Dashboard and admin pages with authentication
  - `api/` – API routes including auth callbacks
  - `(docs)/docs/` – Dynamic documentation pages powered by Contentlayer

- **`config/`** – Centralized configuration:
  - `site.ts` – Site metadata, links, and global config (HARDCODED: needs to be made configurable)
  - `dashboard.ts` – Sidebar navigation structure with role-based access
  - `blog.ts` – Blog settings
  - `docs.ts` – Documentation structure
  - `marketing.ts` – Marketing page configuration

- **`lib/`** – Core utilities:
  - `db.ts` – Prisma client instance
  - `session.ts` – Authentication session utilities
  - `user.ts` – User queries and operations
  - `email.ts` – Email sending via Resend
  - `utils.ts` – General utilities
  - `validations/` – Zod schemas for auth, users, OG images

- **`components/`** – Reusable React components:
  - `ui/` – shadcn/ui components (Radix UI + Tailwind)
  - `dashboard/` – Dashboard-specific components
  - `docs/` – Documentation UI (search, sidebar, pager)
  - `modals/` – Modal components
  - `layout/` – Layout components (navbar, footer)

- **`content/`** – Contentlayer2 content:
  - Blog posts and documentation written in MDX
  - Automatically generated at build time

- **`actions/`** – Server actions for form submissions and mutations
- **`emails/`** – React Email templates for transactional emails
- **`hooks/`** – Custom React hooks
- **`types/`** – TypeScript type definitions

### Tech Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5.9
- **React:** React 19
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 6
- **Authentication:** Auth.js v5 beta 29 (NextAuth successor)
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Content:** Contentlayer2 (MDX support)
- **Email:** React Email + Resend
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

### Authentication & Authorization

**Current Implementation:**
- Auth.js v5 with Prisma adapter
- JWT session strategy
- User roles: `ADMIN` and `USER` (defined in Prisma schema)
- Role checks in route guards and component render logic
- Providers can be configured in `auth.config.ts`

**Session Structure:** User object includes `id`, `email`, `name`, `image`, and `role`

**Key Files:**
- `auth.ts` – Auth.js configuration with callbacks
- `auth.config.ts` – Provider configuration
- `middleware.ts` – Route protection using auth middleware
- `lib/session.ts` – Session helper functions

### Database Schema

Uses Prisma with PostgreSQL. Key models:
- `User` – User profile with role
- `Account` – OAuth provider accounts
- `Session` – User sessions
- `VerificationToken` – Email verification

Run migrations with: `npx prisma migrate dev`

### Content Management

**Contentlayer2 Powers:**
- Dynamic blog pages under `/blog`
- Dynamic documentation under `/docs`
- Generated at build time, not runtime

**Configuration:** `contentlayer.config.ts` defines document types and compilation settings.

### Configuration System (FULLY IMPLEMENTED!)

All previously hardcoded values have been moved to environment variables:

1. **Site Configuration** (via environment variables in `.env.local`):
   - `NEXT_PUBLIC_SITE_NAME` - Site name (default: "AI Starter")
   - `NEXT_PUBLIC_SITE_DESCRIPTION` - Site description
   - `NEXT_PUBLIC_SUPPORT_EMAIL` - Support email address
   - `NEXT_PUBLIC_TWITTER_URL` - Twitter/X profile URL
   - `NEXT_PUBLIC_GITHUB_URL` - GitHub repository URL

2. **How It Works:**
   - Environment variables defined in `.env.example` and `.env.local`
   - Validated through `env.mjs` using Zod schemas
   - Consumed in `config/site.ts` with sensible defaults
   - All values type-safe and validated at build time

3. **Documentation:**
   - See `CONFIGURATION.md` for complete setup guide
   - See `README.md` for quick start instructions
   - All mickasmt references have been removed

### Environment Variables

**Required** (see `.env.example`):
- `NEXT_PUBLIC_APP_URL` – App URL (public, used in client)
- `AUTH_SECRET` – Auth.js secret key (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – OAuth provider credentials
- `DATABASE_URL` – PostgreSQL connection string
- `RESEND_API_KEY` – Email service API key

**Optional** (for customization):
- `NEXT_PUBLIC_SITE_NAME` – Your site name
- `NEXT_PUBLIC_SITE_DESCRIPTION` – Site description for meta tags
- `NEXT_PUBLIC_SUPPORT_EMAIL` – Support email address
- `NEXT_PUBLIC_TWITTER_URL` – Twitter/X profile link
- `NEXT_PUBLIC_GITHUB_URL` – GitHub repository link

### Middleware & Route Protection

`middleware.ts` uses Auth.js to protect routes. Route groups:
- `(protected)` – Requires authentication
- `(marketing)` – Public routes
- Admin routes require `ADMIN` role

### Key Dependencies (UPGRADED!)

All dependencies are now on latest stable/beta versions:
- **Next.js 15.5.6** ✅ (upgraded from 14.2.5)
- **React 19.2.0** ✅ (upgraded from 18.3.1)
- **Auth.js v5.0.0-beta.29** ✅ (upgraded from beta.18)
- **Prisma 6.17.1** ✅ (upgraded from 5.17.0)
- **TypeScript 5.9.3** ✅ (upgraded from 5.5.3)
- shadcn/ui components (Radix UI latest versions)

## Development Guidelines

1. **Adding New Routes:** Use App Router conventions; note that `params` and `searchParams` are now Promises in Next.js 15 (must be awaited)
2. **Adding Components:** Place in appropriate subdirectory under `components/`
3. **Database Changes:** Modify Prisma schema, then run `pnpm prisma migrate dev`
4. **Form Validation:** Use Zod schemas in `lib/validations/`
5. **Styling:** Use Tailwind CSS with shadcn/ui components
6. **API Routes:** Keep in `app/api/` with proper HTTP methods
7. **Configuration:** Add new settings to `.env.example` and `env.mjs`, then update `config/site.ts`
8. **Next.js 15 Changes:**
   - `params` is now a Promise - must await it
   - `cookies()`, `headers()` would be async (not used in this project currently)
   - `experimental.serverComponentsExternalPackages` → `serverExternalPackages`

## Common Issues & Solutions

- **Prisma errors:** Run `npm run postinstall` to generate client
- **Contentlayer build issues:** Clear `.contentlayer` folder and rebuild
- **Auth not persisting:** Check `AUTH_SECRET` is set and consistent
- **Database connection:** Ensure `DATABASE_URL` is correct and network accessible

## Performance Considerations

- Images optimized via `next/image` with remote pattern whitelist (`next.config.js`)
- Contentlayer pre-renders static content at build time
- Server components reduce client JS
- Middleware runs on every request – keep logic minimal
