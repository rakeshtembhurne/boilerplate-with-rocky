---
description: Run database migrations safely with checks and rollback support
parameters:
  createMigration:
    type: boolean
    default: true
    description: Create new migration if schema changed
  generateRollback:
    type: boolean
    default: true
    description: Generate rollback script
  regenerateClient:
    type: boolean
    default: true
    description: Regenerate Prisma client
  seedDatabase:
    type: boolean
    default: false
    description: Run seed script after migration
---

# Database Migration Manager

Run Prisma migrations safely with pre-flight checks.

## Steps

1. Check git status for clean state
2. Review schema changes
3. Create migration (if schema changed)
4. Generate rollback script
5. Apply migration
6. Regenerate Prisma client
7. Run seed data (if enabled)
8. Verify migration success

## Safety

- Requires clean git working directory
- Shows diff of schema changes
- Creates rollback script
- Verifies migration success

## Example

```bash
/migrate-db --create-migration --generate-rollback
```
