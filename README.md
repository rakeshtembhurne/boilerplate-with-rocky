# AI Starter with Rocky - Next.js 16 Enterprise Boilerplate

A modern, production-ready Next.js 16 enterprise-grade boilerplate designed as a go-to foundation for multiple projects. It features a fully configurable architecture through environment variables, supporting authentication, role-based authorization, database management, and containerization with Podman.

**Key Philosophy:** Everything is configurable - site names, emails, social links, feature flags - all through environment variables with type-safe validation.

## Features

- ⚡ **Next.js 16** with App Router and Turbopack
- 🔐 **betterAuth** with email/password and Google OAuth authentication
- 👥 **Role-based Access Control** (ADMIN/USER roles)
- 🎨 **shadcn/ui v2** components + Tailwind CSS 4
- 🗄️ **Prisma 7** ORM with PostgreSQL + custom output directory
- 📧 **Resend** for transactional emails
- 📦 **Products Module** with pluggable architecture
- ⚙️ **Fully Configurable** - Everything in `config/` folder
- 🐳 **Podman** containerization with multi-stage builds
- 🚀 **Bun** runtime for faster development and execution

## Quick Start

### Prerequisites

- **Node.js 18+** or **Bun 1.3+**
- **PostgreSQL 14+**
- **Podman 5+** (optional, for containerization)

### Option 1: Local Development (Recommended)

```bash
# Clone the repository
git clone git@github.com:rakeshtembhurne/boilerplate-with-rocky.git
cd boilerplate-with-rocky

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Setup database
bun run db:migrate    # Run database migrations
bun run db:seed       # Seed database with sample data

# Start development server with Turbo (fastest)
bun run turbo

# or standard dev server
bun run dev
```

### Option 2: Container Development with Podman

```bash
# Copy environment files
cp .env.podman .env.podman.local

# Update .env.podman.local with your values:
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# - DATABASE_URL (if using external database)
# - BETTER_AUTH_SECRET

# Build and start containers
bun run podman:build
bun run podman:up

# View logs
bun run podman:logs
```

### Environment Setup

1. **Required Environment Variables:**
   ```bash
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Authentication (betterAuth)
   BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
   BETTER_AUTH_URL=http://localhost:3000

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```

2. **Optional - Google OAuth:**
   ```bash
   # Get credentials from: https://console.cloud.google.com/apis/credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Optional - Email (Resend):**
   ```bash
   # Get API key from: https://resend.com/api-keys
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ```

## Development Workflow

### Local Development

```bash
# Development servers
bun run dev            # Standard dev server
bun run turbo          # Dev with Turbopack (faster, recommended)

# Code quality
bun run lint           # Run linter
bun run format         # Format code with Prettier
bun run type-check     # Run TypeScript type checking

# Database operations
bun run db:migrate     # Run database migrations
bun run db:studio      # Open Prisma Studio
bun run db:seed        # Seed database with sample data
bun run db:reset       # Reset database (development only)
```

### Container Development

```bash
# Container management
bun run podman:build   # Build container image
bun run podman:up      # Start all services
bun run podman:down    # Stop all services
bun run podman:logs    # View logs
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/         # Sign in page
│   │   ├── sign-up/         # Sign up page
│   │   ├── forgot-password/ # Forgot password flow
│   │   ├── reset-password/  # Reset password flow
│   │   ├── verify-email/    # Email verification
│   │   └── callback/        # OAuth callbacks
│   ├── (marketing)/         # Public pages (landing page)
│   ├── (protected)/         # Protected routes (dashboard, products)
│   ├── (docs)/docs/         # Dynamic documentation pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication forms
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Layout components
│   └── sections/           # Landing page sections
├── config/                 # ⚙️ CONFIGURATION FILES
├── lib/                    # Utilities
│   ├── auth.ts            # betterAuth configuration
│   ├── auth-client.ts     # Client-side auth utilities
│   ├── db.ts              # Prisma client
│   ├── google-auth.ts     # Google OAuth helpers
│   └── validations/       # Zod schemas
├── prisma/                # Database
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data
│   └── migrations/        # Database migrations
├── podman/                # Container configuration
│   ├── Containerfile      # Container definition
│   └── podman-compose.yml # Docker Compose equivalent
├── actions/               # Server actions
└── emails/                # Email templates
```

## Configuration

All configuration is centralized and type-safe:

- **`config/site.ts`** - Site metadata, links, global config
- **`config/dashboard.ts`** - Dashboard navigation with role-based access
- **`config/landing.ts`** - Landing page sections configuration
- **`config/blog.ts`** - Blog settings and categories
- **`config/docs.ts`** - Documentation structure

## Tech Stack

- **Runtime:** Bun 2.x
- **Framework:** Next.js 16 (App Router + React Server Components)
- **Language:** TypeScript 5.9+
- **React:** React 19
- **Database:** PostgreSQL with Prisma 7
- **Auth:** betterAuth (email/password + Google OAuth)
- **UI:** shadcn/ui v2 + Radix UI + Tailwind CSS 4
- **Email:** Resend
- **Containerization:** Podman 5.x

## Authentication & Authorization

### Configuration

betterAuth is configured in `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
  baseURL: process.env.NODE_ENV === "production"
    ? env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      enabled: !!env.GOOGLE_CLIENT_ID,
    },
  },
})
```

### User Session Structure

User object includes:
- `id` – User UUID (CUID)
- `email` – Email address
- `emailVerified` – Boolean verification status
- `name` – Display name
- `image` – Profile picture URL
- `role` – User role (`ADMIN` | `USER`)
- `createdAt` – Account creation date
- `updatedAt` – Last update timestamp

### Role-Based Access Control

**Prisma Schema:**
```prisma
enum UserRole {
  ADMIN
  USER
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}
```

## Database Schema (Prisma 7)

### Schema Configuration

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  runtime  = "bun"
  output   = "./prisma/generated"
}

datasource db {
  provider = "postgresql"
}
```

### Key Models

**User Model:**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}
```

**Session Model (betterAuth):**
```prisma
model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("session")
}
```

**Account Model (OAuth):**
```prisma
model Account {
  id         String   @id @default(cuid())
  accountId  String
  providerId String
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  password   String?  @db.Text

  @@index([userId])
  @@map("account")
}
```

### Migrations

This boilerplate uses a **single initial migration** for a clean starting point:

```bash
prisma/migrations/
└── 20240705000000_init/
    └── migration.sql  # Complete initial schema
```

To add new migrations:
```bash
# After modifying schema.prisma
bun run db:migrate
```

## Products Module - Pluggable Architecture

This project includes a self-contained products module demonstrating plugin-style architecture.

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated, filterable) |
| POST | `/api/products` | Create product |
| GET | `/api/products/[id]` | Get single product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |
| GET | `/api/products/filters` | Get filter options (cached 5min) |
| GET | `/api/products/stats` | Get products statistics |

### Products Structure

```
app/(protected)/products/
├── [id]/
│   └── edit/
│       └── page.tsx          # Edit product page
├── create/
│   └── page.tsx              # Create product page
├── page.tsx                  # Products list page
├── _components/
│   ├── product-form.tsx      # Product form component
│   └── product-list.tsx      # Product list component
└── _lib/
    ├── server-api.ts         # Server-side API
    ├── api-client.ts         # Client-side API wrapper
    ├── api-response.ts       # Type definitions
    ├── cache.ts              # Query cache
    └── _validations/
        └── product.ts        # Zod validation schema
```

## Containerization with Podman

### Containerfile Structure

The project includes three optimized Containerfiles:

1. **`podman/Containerfile`** - Standard multi-stage build
2. **`podman/Containerfile.optimized`** - Optimized for size
3. **`podman/Containerfile.optimized.v2`** - Highly optimized with minimal layers

### Building Containers

```bash
# Using bun scripts
bun run podman:build

# Or directly with podman
podman build -f podman/Containerfile -t ai-starter:latest .
```

### Running Containers

```bash
# Start services
bun run podman:up

# Stop services
bun run podman:down

# View logs
bun run podman:logs

# Execute commands in container
podman exec -it ai-starter-app sh
```

## Environment Variables

### Required

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Optional - Authentication

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Optional - Email

```bash
# Resend
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

## Development Commands Reference

```bash
# Dependencies
bun install                    # Install dependencies

# Development
bun run dev                    # Start development server
bun run turbo                  # Start with Turbopack (faster)

# Build & Deploy
bun run build                  # Build for production
bun start                      # Start production server
bun run preview                # Preview production build locally

# Database
bun run db:migrate             # Run database migrations
bun run db:studio              # Open Prisma Studio
bun run db:seed                # Seed database with sample data
bun run db:reset               # Reset database (dev only)
bun run postinstall            # Generate Prisma client

# Code Quality
bun run lint                   # Run ESLint
bun run format                 # Format with Prettier
bun run type-check             # Run TypeScript check

# Container Management
bun run podman:up              # Start containers
bun run podman:down            # Stop containers
bun run podman:build           # Build containers
bun run podman:logs            # View container logs

# Email Development
bun run email                  # Start React Email dev server
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
   - Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - Optional: `RESEND_API_KEY`, `FROM_EMAIL`
4. Deploy!

### Podman/Docker

1. Build container: `bun run podman:build`
2. Deploy to your container orchestrator
3. Set environment variables
4. Run container

```bash
podman run -d \
  -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e BETTER_AUTH_SECRET="..." \
  --name ai-starter \
  ai-starter:latest
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes using port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Run `bun run db:studio` to inspect database

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear Prisma cache
rm -rf prisma/prisma/generated

# Regenerate Prisma client
bun run postinstall

# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

**Authentication issues:**
- Verify `BETTER_AUTH_SECRET` is set
- Check `BETTER_AUTH_URL` matches your domain
- Clear browser cookies and re-authenticate
- Check console for auth errors

**Migration issues:**
```bash
# Reset database (WARNING: deletes all data)
bun run db:reset

# Or manually:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
bun run db:migrate
bun run db:seed
```

### Development Tips

1. **Use Turbopack:** `bun run turbo` is significantly faster
2. **Type Safety:** Run `bun run type-check` before committing
3. **Database:** Use `bun run db:studio` to explore data visually
4. **Auth Testing:** Test auth flow locally before deploying
5. **Email Templates:** Use `bun run email` to preview email templates

## License

MIT License - feel free to use this boilerplate for your projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
- Check the documentation in `app/(docs)/`
- Create an issue on GitHub
- Review existing issues and discussions

---

**Built with ❤️ using Next.js 16, Prisma 7, and betterAuth**
