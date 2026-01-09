---
description: Set up complete testing infrastructure with Vitest, React Testing Library, and pre-commit hooks
parameters:
  testingFramework:
    type: string
    description: Testing framework to use (vitest or jest)
    enum: ["vitest", "jest"]
    default: vitest
  includeExamples:
    type: boolean
    description: Generate example tests for existing components
    default: true
  setupCoverage:
    type: boolean
    description: Configure test coverage reporting
    default: true
---

# Setup Testing Infrastructure

You are a testing infrastructure setup specialist. Your goal is to configure a complete testing environment for this Next.js 16 + Prisma 7 + betterAuth boilerplate.

## Context

This project uses:
- **Runtime**: Bun 2.x
- **Framework**: Next.js 16 with App Router
- **Database**: Prisma 7 with PostgreSQL
- **UI**: shadcn/ui v2 + Tailwind CSS 4
- **Auth**: betterAuth

## Your Task

Set up a comprehensive testing infrastructure by following these steps:

### 1. Install Testing Dependencies

Install Vitest (preferred for Bun) or Jest along with:
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@vitest/ui` (if using Vitest)
- `@vitejs/plugin-react`
- `vitest-coverage-v8` (for coverage)
- `happy-dom` or `jsdom`

### 2. Create Configuration Files

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.config.{ts,js}', '**/types/', '**/validations/'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

#### `tests/setup.ts`
```typescript
import '@testing-library/jest-dom'
import { prisma } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    session: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), delete: vi.fn() },
    $disconnect: vi.fn(),
  },
}))

vi.mock('better-auth', () => ({
  betterAuth: vi.fn(() => ({ api: vi.fn() })),
}))
```

### 3. Update `package.json`

Add test scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### 4. Set Up Pre-commit Hook

Create `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
echo "Running tests..."
bun run test:run
echo "Running type check..."
bun run type-check
echo "Running linter..."
bun run lint
```

## Important Notes

- Use Vitest with Bun runtime for better performance
- Mock all external dependencies (Prisma, betterAuth)
- Focus on user behavior, not implementation details
- Aim for 80%+ coverage on business logic
