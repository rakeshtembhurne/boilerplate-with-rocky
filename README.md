# AI with Rocky - Next.js Starter

A modern, production-ready AI starter built with Next.js 15, featuring authentication, role-based authorization, and content management.

## Features

- ⚡ **Next.js 15** with App Router
- 🔐 **Auth.js v5** with role-based access control (ADMIN/USER)
- 📝 **MDX Content** for blog and documentation
- 🎨 **shadcn/ui** components + Tailwind CSS
- 🗄️ **Prisma** ORM with PostgreSQL
- 📧 **React Email** + Resend for transactional emails
- ⚙️ **Fully Configurable** - Everything in `config/` folder

## Known Issues

### Next.js 15 + React 19 Development Mode Error

**Issue**: React 19.2.0 has a known bug in development mode causing errors:
- `Cannot read properties of undefined (reading 'A')`
- `Cannot read properties of undefined (reading 'recentlyCreatedOwnerStacks')`

**Why**: Next.js 15.5.6 requires React 19, but React 19.2.0 has development mode bugs.

**Impact**:
- ⚠️ Development server (`pnpm dev`) shows errors on blog/docs pages
- ✅ Production builds (`pnpm build && pnpm start`) work **perfectly**

**Workaround**: For testing without errors:
```bash
pnpm build
pnpm start
```

**Note**: This is a known React 19 issue. The framework is production-ready despite the dev mode warnings.

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_APP_URL` - Your app URL
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `RESEND_API_KEY` - Email service API key

### 3. Configure Your Site

Edit `config/site.ts` to customize:

```typescript
export const siteConfig: SiteConfig = {
  name: "Your Site Name",
  description: "Your description",
  url: site_url,
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername/yourrepo",
  },
  mailSupport: "support@yourdomain.com",
};
```

### 4. Set Up Database

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

All configuration is in the `config/` directory:

- **`config/site.ts`** - Site name, description, social links, support email
- **`config/dashboard.ts`** - Dashboard sidebar navigation with role-based access
- **`config/blog.ts`** - Blog categories and authors
- **`config/docs.ts`** - Documentation structure
- **`config/marketing.ts`** - Marketing pages navigation

Simply edit these files to customize your site!

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages
│   ├── (protected)/        # Protected routes (dashboard, admin)
│   ├── (docs)/            # Documentation pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── config/               # ⚙️ CONFIGURATION FILES - Edit these!
├── content/              # MDX content (blog & docs)
├── lib/                  # Utilities
├── prisma/              # Database schema
└── emails/              # Email templates
```

## Available Commands

```bash
# Development
pnpm dev            # Start dev server
pnpm turbo          # Start dev with Turbopack (faster)

# Production
pnpm build          # Build for production
pnpm start          # Start production server

# Database
pnpm prisma migrate dev     # Run migrations
pnpm prisma studio          # Open database GUI

# Other
pnpm lint                    # Run linter
pnpm email                   # Email dev server (port 3333)
pnpm remove-content          # Remove blog/docs
```

## Tech Stack

- **Framework:** Next.js 15.5.6
- **React:** 19.2.0 (latest)
- **Language:** TypeScript 5.9
- **Database:** PostgreSQL with Prisma 6
- **Auth:** Auth.js v5
- **UI:** shadcn/ui + Radix UI + Tailwind CSS
- **Content:** Contentlayer2 (MDX)
- **Email:** React Email + Resend

## Customization Guide

### Adding Blog Posts

Create `.mdx` files in `content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Post description"
date: "2025-01-15"
authors:
  - author
categories:
  - news
---

Your content here...
```

### Adding Documentation

Create `.mdx` files in `content/docs/` and update `config/docs.ts` navigation.

### Changing Colors

Edit `app/globals.css` to customize your theme colors.

### Adding OAuth Providers

1. Add credentials to `.env.local`
2. Update `auth.config.ts`

```typescript
import GitHub from "next-auth/providers/github"

export default {
  providers: [
    Google(...),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Make sure to set all environment variables in your hosting platform.

## License

MIT

## Support

For issues or questions, check the documentation in `/docs` or open an issue on GitHub.
