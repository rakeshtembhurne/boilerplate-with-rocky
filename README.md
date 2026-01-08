# AI Starter with Rocky - Next.js 16 Enterprise Boilerplate

A modern, production-ready Next.js 16 enterprise-grade boilerplate designed as a go-to foundation for multiple projects. It features a fully configurable architecture through environment variables, supporting multi-section content management (blog, docs, dashboard), user authentication, role-based authorization, and containerization with Podman.

**Key Philosophy:** Everything is configurable - site names, emails, social links, feature flags - all through environment variables with type-safe validation.

## Features

- ⚡ **Next.js 16.1** with App Router and Turbopack (fastest development experience)
- 🔐 **betterAuth 1.4.10** with email/password and OAuth authentication
- 👥 **Role-based Access Control** (ADMIN/USER roles)
- 📝 **MDX Content** for blog and documentation
- 🎨 **shadcn/ui v2** components + Tailwind CSS 4
- 🗄️ **Prisma 7** ORM with PostgreSQL + Zod schema generation
- 📧 **React Email** + Resend for transactional emails
- ⚙️ **Fully Configurable** - Everything in `config/` folder
- 🐳 **Podman** containerization with multi-stage builds
- 🚀 **Bun** runtime for faster development and execution

## Quick Start

### Option 1: Local Development (Recommended)
```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Start development server with Turbo (fastest)
make dev-turbo
# or
bun run turbo
```

### Option 2: Container Development with Podman
```bash
# Initialize development environment
make init

# Build containers
make build

# Start all services
make up

# View logs
make logs
```

### Environment Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env.local        # Local development
   cp .env.podman .env.podman.local   # Container development
   ```

2. **Fill in required variables:**
   - `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `DATABASE_URL` - PostgreSQL connection string
   - Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Development Workflow

### Local Development
```bash
make dev           # Start development server locally
make dev-turbo      # Start with Turbopack (recommended)
make type-check     # Run TypeScript type checking
make lint          # Run linter
make format        # Format code
```

### Database Operations
```bash
bun run db:migrate     # Run database migrations
bun run db:studio      # Open Prisma Studio
bun run db:seed        # Seed database with sample data
bun run db:reset       # Reset database (development only)
```

### Container Development
```bash
make build         # Build container image
make up            # Start all services
make down          # Stop all services
make logs          # View logs
make shell         # Get shell in app container
```

### Production Deployment
```bash
# Build for production
make build

# Start production services
make up-prod

# View production logs
make logs-prod
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages (landing, blog, docs)
│   ├── (protected)/        # Protected routes (dashboard, admin)
│   ├── (docs)/docs/        # Dynamic documentation pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── layout/           # Layout components
├── config/               # ⚙️ CONFIGURATION FILES - Edit these!
├── content/              # MDX content (blog & docs)
├── lib/                  # Utilities (auth, db, email, etc.)
├── prisma/              # Database schema
├── emails/              # Email templates
├── podman/              # Container configuration
└── actions/             # Server actions
```

## Configuration

All configuration is centralized and type-safe through environment variables:

- **`config/site.ts`** - Site metadata, links, global config
- **`config/dashboard.ts`** - Dashboard navigation with role-based access
- **`config/blog.ts`** - Blog settings and categories
- **`config/docs.ts`** - Documentation structure
- **`config/marketing.ts`** - Marketing pages navigation

## Tech Stack

- **Runtime:** Bun 2.x
- **Framework:** Next.js 16.1.1 (App Router + React Server Components)
- **Language:** TypeScript 5.9+
- **React:** React 19
- **Database:** PostgreSQL 18 with Prisma 7+ and Zod schemas
- **Auth:** betterAuth 1.4.10 (email/password + OAuth)
- **UI:** shadcn/ui v2 + Radix UI + Tailwind CSS 4.1.14
- **Content:** Contentlayer2 (MDX)
- **Email:** React Email + Resend
- **Containerization:** Podman 5.x

## Authentication & Authorization

### Configuration

betterAuth is configured in `lib/auth.ts` with full type safety:

```typescript
export const auth = betterAuth({
  baseURL: process.env.NODE_ENV === "production"
    ? env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      enabled: true,
    },
  },
})
```

### Session Structure

User object includes:
- `id` – User UUID
- `email` – Email address (verified/unverified)
- `name` – Display name
- `image` – Profile picture URL
- `role` – User role (`ADMIN` | `USER`)
- `emailVerified` – Verification timestamp
- `createdAt` – Account creation date
- `updatedAt` – Last update timestamp

### Role-Based Access Control

**Defined in Prisma Schema:**
```prisma
enum Role {
  ADMIN
  USER
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  // ... other fields
}
```

## Database Schema (Prisma + Zod)

### Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["zodSchemas"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String?
  image            String?
  role             Role      @default(USER)
  emailVerified    DateTime?
  accounts         Account[]
  sessions         Session[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@map("users")
}

enum Role {
  ADMIN
  USER
}
```

### Auto-Generated Zod Schemas

Prisma 7+ automatically generates Zod schemas that match your models:

```typescript
import { z } from "zod"
import { UserSchema } from "@/lib/db" // Auto-generated

// Extend auto-generated schema
export const CreateUserSchema = UserSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
}).required({
  email: true,
})
```

## Products Module - Plugin Architecture

This project includes a self-contained products module demonstrating plugin-style architecture:

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated, filterable) |
| POST | `/api/products` | Create product |
| GET | `/api/products/[id]` | Get single product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |
| GET | `/api/products/filters` | Get filter options (cached 5min) |

### TypeScript Path Alias

Import from products module using `@/products/*`:

```typescript
import { Product } from "@/products/_types";
import { getProducts } from "@/products/_lib/api-client";

// Fetch products
const { products, pagination } = await getProducts({
  page: 1,
  search: "laptop",
  categories: ["Electronics"],
  statuses: ["ACTIVE"]
});
```

## Containerization with Podman

### Development Workflow

```bash
# Make commands (recommended)
make build         # Build container image
make up            # Start all services
make down          # Stop all services
make logs          # View logs

# Direct podman commands
podman-compose -f podman/podman-compose.yml up -d
podman-compose -f podman/podman-compose.yml down
```

### Production Deployment

```bash
# Build for production
make build

# Start production services
make up-prod

# View production logs
make logs-prod
```

## Environment Variables

### Required
```bash
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Auth
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Optional - Authentication
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Optional - Site Customization
```bash
# Site Identity
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com

# Social Links
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourhandle
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourprofile
```

### Optional - Feature Flags
```bash
# Enable/Disable Features
ENABLE_BLOG=true
ENABLE_DOCS=true
ENABLE_ANALYTICS=false
```

## Development Commands

```bash
# Install dependencies
bun install

# Development servers
bun run dev            # Standard dev server
bun run turbo          # Dev with Turbopack (faster)

# Production build and deployment
bun run build          # Build for production
bun start              # Start production server
bun run preview        # Preview production build locally

# Database
bun run db:migrate     # Run database migrations
bun run db:studio      # Open Prisma Studio
bun run db:seed        # Seed database with sample data
bun run db:reset       # Reset database (development only)

# Code quality
bun run lint           # Run linter
bun run format         # Format code
bun run type-check     # Run TypeScript type checking

# Email development
bun run email          # Email dev server

# Content management
bun run remove-content # Remove blog/docs sections

# Container management
bun run podman:up      # Start containers
bun run podman:down    # Stop containers
bun run podman:build   # Build containers
bun run podman:logs    # View logs
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Docker/Podman
1. Build container: `make build`
2. Deploy to your container orchestrator
3. Set environment variables

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes using port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check if database container is running
- Run `bun run db:studio` to inspect database

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

**Better Auth issues:**
- Verify `BETTER_AUTH_SECRET` is set and consistent
- Check `BETTER_AUTH_URL` matches your domain
- Clear cookies and re-authenticate

### Development Tips

1. **Use Turbopack:** `bun run turbo` is significantly faster than standard dev server
2. **Type Safety:** Run `bun run type-check` before committing
3. **Database:** Use `bun run db:studio` to explore your database
4. **Authentication:** Use `bun run dev` and test authentication flow locally first

## License

MIT

## Support

For issues or questions, check the documentation in `/docs` or create an issue on GitHub.