---
description: Set up development environment with all prerequisites, dependencies, and configuration
parameters:
  skipPrerequisites:
    type: boolean
    default: false
    description: Skip prerequisite checks
  generateSecrets:
    type: boolean
    default: true
    description: Generate BETTER_AUTH_SECRET and other secrets
  initializeDatabase:
    type: boolean
    default: true
    description: Run migrations and seed database
  setupGitHooks:
    type: boolean
    default: true
    description: Set up Git hooks for quality checks
---

# Development Environment Setup

Set up complete development environment for this Next.js 16 boilerplate.

## Prerequisites

- Bun 2.x
- PostgreSQL 14+
- Podman 5.x (optional)

## Steps

1. Check prerequisites (unless skipped)
2. Install dependencies with `bun install`
3. Create .env.local with secrets (if enabled)
4. Prompt for configuration values
5. Initialize database (if enabled)
6. Set up Git hooks (if enabled)
7. Run quality checks

## Example

```bash
/setup-env --generate-secrets --initialize-database
```
