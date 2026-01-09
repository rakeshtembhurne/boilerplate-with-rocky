---
description: Create a complete plugin with route groups, sub-features, pages, API routes, and navigation integration
parameters:
  pluginName:
    type: string
    description: Name of the plugin (e.g., 'blogging', 'ecommerce')
  subFeatures:
    type: array
    description: List of sub-features (e.g., ['authors', 'posts'])
  addPrismaModels:
    type: boolean
    default: false
    description: Generate Prisma models for sub-features
  runMigrations:
    type: boolean
    default: false
    description: Run Prisma migrations after creating models
  withAuthentication:
    type: boolean
    default: true
    description: Add authentication middleware to plugin routes
---

# Plugin Scaffolder

Create complete, production-ready plugins following the plugin architecture pattern.

## Structure

Create `(plugin-name)/` route group in `app/(protected)/` with sub-features containing:
- `_components/` - UI components
- `_lib/` - Server and client API
- `_types/` - TypeScript types
- `_validations/` - Zod schemas
- Pages: list, create, edit

## Steps

1. Validate plugin name (lowercase, hyphens)
2. Create route group structure
3. Generate sub-feature folders
4. Create server API functions
5. Create client API wrapper
6. Generate API routes
7. Build pages (list, create, edit)
8. Create form and table components
9. Update navigation config
10. Optionally add Prisma models and run migrations

## Example

```bash
/create-plugin blogging --sub-features authors,posts,categories
```

## Files

See `CLAUDE.md` for complete plugin architecture details.
