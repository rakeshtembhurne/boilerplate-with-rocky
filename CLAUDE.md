# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 16** enterprise-grade boilerplate with **plugin-based architecture**, designed for building scalable applications with modular, pluggable features. It supports user authentication, role-based authorization, database management, and containerization with Podman.

**Key Philosophy:**
- Everything is configurable through environment variables with type-safe validation
- **Modular plugin architecture** - Features are self-contained plugins that can be added/removed
- Follows Git Flow branching model for organized development
- Uses Google commit message format for clear version history

## Git Flow Workflow

This project strictly follows the **Git Flow branching model** (Atlassian variant):

### Branch Structure

1. **`main`** – Production-ready code
   - Always stable and deployable
   - Tags for production releases (e.g., `v1.0.0`)
   - No direct development on this branch

2. **`develop`** – Integration branch for features
   - Created from `main`
   - All feature branches branch off from `develop`
   - Contains the latest delivered development changes
   - When `develop` stabilizes, it gets merged back to `main`

3. **`feature/*`** – Feature branches
   - Branch from: `develop`
   - Naming: `feature/feature-name` (e.g., `feature/user-auth`, `feature/products-api`)
   - Merge back to: `develop`
   - Never merge directly to `main`

4. **`release/*`** – Release preparation branches (optional)
   - Branch from: `develop`
   - Naming: `release/v1.0.0`
   - Merge to: `main` AND `develop`
   - Allow for last-minute testing, bug fixes, and version tagging

5. **`hotfix/*`** – Emergency production fixes (optional)
   - Branch from: `main`
   - Naming: `hotfix/critical-bug-fix`
   - Merge to: `main` AND `develop`

### Workflow Example

```bash
# 1. Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-plugin

# 2. Do development work
# ... make changes, commit ...

# 3. Finish feature
git checkout develop
git merge --no-ff feature/new-plugin  # Creates merge commit
git push origin develop
git branch -d feature/new-plugin

# 4. When ready for release
git checkout main
git merge --no-ff develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### Important Git Flow Rules

- **ALWAYS** use `--no-ff` flag when merging to preserve branch history
- **NEVER** commit directly to `main` (except for hotfixes)
- **ALWAYS** pull latest `develop` before creating feature branches
- **NEVER** merge feature branches directly to `main`
- Delete local feature branches after successful merge to `develop`

## Commit Message Format (Google Style)

All commit messages must follow **Google's commit message style guide**:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)

Must be one of:
- **feat** – New feature
- **fix** – Bug fix
- **docs** – Documentation changes only
- **style** – Code style changes (formatting, no logic change)
- **refactor** – Code refactoring (neither fixes bug nor adds feature)
- **perf** – Performance improvement
- **test** – Adding or updating tests
- **chore** – Maintenance tasks, updating dependencies, etc.
- **revert** – Revert a previous commit

### Scope (Optional)

The scope should be the name of the plugin/module affected:
- **auth** – Authentication changes
- **products** – Products plugin changes
- **database** – Database schema/migrations
- **ui** – UI components
- **api** – API routes
- **config** – Configuration changes
- **deps** – Dependencies

### Subject (Required)

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 72 characters or less

### Body (Optional)

- Explain WHAT and WHY (not HOW)
- Wrap at 72 characters
- Use imperative mood

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Multiple issues: `Closes #123, #456, #789`
- Breaking changes: `BREAKING CHANGE: <description>`

### Examples

```bash
# Simple feature
feat(products): add product filtering by category

# Bug fix
fix(auth): resolve session timeout on mobile devices

# Documentation
docs(readme): update installation instructions for Podman

# Breaking change
feat(api): redesign product response structure

BREAKING CHANGE: Product response now uses nested structure
for variants. Update API clients accordingly.

# Multiple lines
feat(products): implement bulk product import

Add CSV upload functionality for importing multiple products
at once. This includes validation, error handling, and
progress tracking.

Features:
- CSV file upload via drag-and-drop
- Real-time validation feedback
- Batch creation with error recovery
- Import history and rollback capability

Closes #123, #456
```

## Plugin Architecture

This boilerplate uses a **pluggable modular architecture** where each feature is a self-contained plugin that can be easily added or removed.

### Plugin Structure

Each plugin follows this standard structure under `app/(protected)/`:

```
app/(protected)/<plugin-name>/
├── _components/          # Plugin-specific UI components
│   ├── <component-a>.tsx
│   └── <component-b>.tsx
├── _lib/                 # Plugin business logic
│   ├── server-api.ts     # Server-side API calls
│   ├── api-client.ts     # Client-side API wrapper
│   ├── api-response.ts   # TypeScript interfaces
│   └── cache.ts          # Query caching logic
├── _types/               # TypeScript type definitions
│   └── index.ts
├── _validations/         # Zod validation schemas
│   └── <entity>.ts
├── page.tsx              # Main plugin page (list view)
├── create/
│   └── page.tsx          # Create entity page
└── [id]/
    └── edit/
        └── page.tsx      # Edit entity page
```

### Plugin Rules

1. **Self-Contained**: All plugin code (except API routes) MUST be within the plugin folder
2. **Underscore Prefix**: Private folders use underscore prefix (`_components`, `_lib`, `_types`)
3. **No External Dependencies**: Plugin should not import from other plugins
4. **API Separation**: API routes go in `app/api/<plugin-name>/` (outside plugin folder)
5. **Shared Utilities**: Common utilities go in `lib/` (can be used by multiple plugins)
6. **Independent Removal**: Removing the plugin folder should completely remove the feature

### Example: Products Plugin

```
app/(protected)/products/
├── _components/
│   ├── product-form.tsx       # Add/edit form
│   └── product-list.tsx       # Data table with filters
├── _lib/
│   ├── server-api.ts          # Server actions for products
│   ├── api-client.ts          # Client wrapper with caching
│   ├── api-response.ts        # Response type definitions
│   └── cache.ts               # React Query cache keys
├── _types/
│   └── index.ts               # Product interfaces
├── _validations/
│   └── product.ts             # Zod schema for product validation
├── page.tsx                   # Products list page
├── create/page.tsx            # Create new product
└── [id]/edit/page.tsx         # Edit existing product

app/api/products/              # API routes (separate location)
├── route.ts                   # GET /api/products, POST /api/products
├── [id]/route.ts              # GET/PUT/DELETE /api/products/[id]
├── filters/route.ts           # GET /api/products/filters
└── stats/route.ts             # GET /api/products/stats
```

### Creating a New Plugin

When adding a new plugin (e.g., "orders"):

1. **Create Plugin Structure:**
   ```bash
   mkdir -p app/(protected)/orders/{_components,_lib,_types,_validations}
   mkdir -p app/(protected)/orders/{create,[id]/edit}
   ```

2. **Add Plugin Files:**
   - Create components in `_components/`
   - Add business logic in `_lib/`
   - Define types in `_types/`
   - Add validation schemas in `_validations/`
   - Create pages: `page.tsx`, `create/page.tsx`, `[id]/edit/page.tsx`

3. **Create API Routes:**
   ```bash
   mkdir -p app/api/orders/[id]
   ```

4. **Update Navigation:**
   - Add to `config/dashboard.ts` (if menu item needed)

5. **Test Plugin Independence:**
   - Verify removing the folder removes the feature
   - Ensure no broken imports remain

### Removing a Plugin

To completely remove a plugin:

1. Delete plugin folder: `rm -rf app/(protected)/<plugin-name>/`
2. Delete API routes: `rm -rf app/api/<plugin-name>/`
3. Remove from navigation: Edit `config/dashboard.ts`
4. Remove database models (if applicable): Edit `prisma/schema.prisma`
5. Run migration: `bun run db:migrate`

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

# Generate Prisma client
bun run postinstall

# Database operations
bun run db:migrate    # Run migrations
bun run db:studio    # Open Prisma Studio
bun run db:seed      # Seed database
bun run db:reset     # Reset database (dev only)

# Podman commands
bun run podman:up      # Start containers
bun run podman:down    # Stop containers
bun run podman:build   # Build containers
bun run podman:logs    # View logs
```

## Project Structure

### Key Directories

- **`app/`** – Next.js 16 App Router:
  - `(auth)/` – Authentication pages (sign-in, sign-up, password reset)
  - `(marketing)/` – Public pages, landing page
  - `(protected)/` – Protected routes requiring authentication
    - Contains all plugin directories
  - `(docs)/` – Documentation pages
  - `api/` – API routes (organized by plugin)

- **`config/`** – Centralized configuration:
  - `site.ts` – Site metadata and global settings
  - `dashboard.ts` – Navigation with role-based access
  - `landing.ts` – Landing page sections

- **`lib/`** – Core utilities (shared across plugins):
  - `db.ts` – Prisma client
  - `auth.ts` – betterAuth configuration
  - `session.ts` – Session management
  - `validations/` – Shared Zod schemas
  - `utils.ts` – General utilities

- **`components/`** – Shared React components:
  - `ui/` – shadcn/ui v2 components (used by all plugins)
  - `auth/` – Authentication forms
  - `dashboard/` – Dashboard layout components
  - `layout/` – Layout components
  - `sections/` – Landing page sections

- **`actions/`** – Server actions (shared across app)
- **`podman/`** – Container configuration files

## Tech Stack

- **Runtime:** Bun 2.x
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.9+
- **React:** React 19
- **Database:** PostgreSQL with Prisma 7
- **Auth:** betterAuth (email/password + Google OAuth)
- **UI:** shadcn/ui v2 + Radix UI + Tailwind CSS 4
- **Container:** Podman 5.x

## Key Conventions

### 1. Plugin Architecture
- All plugins MUST be self-contained
- Use underscore prefix for private folders (`_components`, `_lib`, `_types`)
- API routes are separate from plugin folder structure
- Never import from one plugin to another

### 2. Route Groups
- `(auth)/` – Authentication routes (no layout)
- `(marketing)/` – Public pages
- `(protected)/` – Protected routes with authentication
- `(docs)/` – Documentation

### 3. Async Parameters
Always await `params` and `searchParams` in pages:
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

### 4. Components
- Use Server Components by default
- Add `"use client"` only when interactive features are needed
- Shared UI components go in `components/ui/`
- Plugin-specific components go in `<plugin>/_components/`

### 5. Database Changes
1. Update `prisma/schema.prisma`
2. Run `bun run db:migrate` to create migration
3. Run `bun run postinstall` to regenerate Prisma client
4. Update plugin `_validations/` if schema affects plugin

### 6. Forms
- Use React Hook Form with Zod validation
- Server actions for form submissions
- Validation schemas in plugin `_validations/` folder
- Use `schema.safeParse()` in Server Actions

### 7. Authentication
- Configured in `lib/auth.ts`
- Role-based access control (`ADMIN` | `USER`)
- Check session in protected pages

### 8. Environment Variables
- Validate in `env.mjs` using @t3-oss/env-nextjs
- Server variables use `env.*` (no `NEXT_PUBLIC_`)
- Client variables use `env.NEXT_PUBLIC_*`
- Add new vars to `.env.example`

### 9. Styling
- Tailwind CSS 4.x with custom theme
- Components use Tailwind classes directly
- No CSS modules or global styles

### 10. Code Organization
- Keep plugins independent and self-contained
- Don't create circular dependencies
- Use TypeScript strict mode
- Follow the established folder structure

## Important Notes

- **Plugin Independence**: Each plugin must work independently
- **Git Flow Discipline**: Always follow Git Flow branching model
- **Commit Messages**: Use Google commit message format
- **No AI Attribution**: Never mention AI tools in commits or docs
- **Type Safety**: Leverage TypeScript for all code
- **Await Promises**: Always await `params` and `searchParams`
- **Environment Config**: Everything via environment variables
- **Podman First**: Use Podman (not Docker) for containers

## File Locations

- Prisma schema: `prisma/schema.prisma`
- Auth config: `lib/auth.ts`
- Environment validation: `env.mjs`
- Site config: `config/site.ts`
- Dashboard nav: `config/dashboard.ts`
- Container config: `podman/`
- Plugin example: `app/(protected)/products/`

## Adding a New Plugin Checklist

When adding a new feature as a plugin:

- [ ] Create plugin folder structure with `_components`, `_lib`, `_types`, `_validations`
- [ ] Build all UI components in `_components/`
- [ ] Implement server API in `_lib/server-api.ts`
- [ ] Create client wrapper in `_lib/api-client.ts`
- [ ] Define types in `_types/index.ts`
- [ ] Add Zod schemas in `_validations/`
- [ ] Create pages: `page.tsx`, `create/page.tsx`, `[id]/edit/page.tsx`
- [ ] Add API routes in `app/api/<plugin-name>/`
- [ ] Update `config/dashboard.ts` for navigation
- [ ] Update Prisma schema if needed
- [ ] Run migrations: `bun run db:migrate`
- [ ] Test plugin works independently
- [ ] Test removing folder removes functionality
- [ ] Create feature branch from `develop`
- [ ] Commit with Google-style message
- [ ] Merge back to `develop` with `--no-ff`

## Plugin Best Practices

1. **Encapsulation**: Keep all plugin code within the plugin directory
2. **No Coupling**: Don't import from other plugins
3. **Shared Types**: Put shared types in `lib/types/`
4. **API Consistency**: Follow REST conventions for API routes
5. **Error Handling**: Implement proper error handling in `_lib/`
6. **Loading States**: Add loading skeletons in `_components/`
7. **Validation**: Use Zod schemas in `_validations/`
8. **Testing**: Test plugin independently before integration
9. **Documentation**: Document plugin-specific logic in code comments
10. **Clean Removal**: Ensure plugin can be removed cleanly

---

**Remember:** This is a boilerplate for creating applications. The plugin architecture makes it easy to add/remove features. Always follow Git Flow and use proper commit messages!
