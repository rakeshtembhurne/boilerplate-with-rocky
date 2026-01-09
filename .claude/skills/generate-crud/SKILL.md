---
description: Generate complete CRUD operations for an existing Prisma model including pages, API routes, and components
parameters:
  modelName:
    type: string
    description: Name of the Prisma model (e.g., 'User', 'Product')
  generatePages:
    type: boolean
    default: true
    description: Generate list, create, and edit pages
  generateApiRoutes:
    type: boolean
    default: true
    description: Generate REST API routes
  generateComponents:
    type: boolean
    default: true
    description: Generate form and table components
  generateTests:
    type: boolean
    default: false
    description: Generate test files
  pluginName:
    type: string
    description: Plugin to add CRUD to (if not provided, creates new route group)
---

# CRUD Generator

Generate complete CRUD operations for Prisma models.

## Steps

1. Analyze Prisma model fields
2. Generate server API functions (get, list, create, update, delete)
3. Create client API wrapper with React Query
4. Build REST API routes
5. Generate pages (list, create, edit)
6. Create form component with validation
7. Create table component with sorting/filtering
8. Update navigation (if needed)

## Example

```bash
/generate-crud Post --plugin-name blogging --generate-pages
```
