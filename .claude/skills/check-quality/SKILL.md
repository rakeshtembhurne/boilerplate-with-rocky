---
description: Run comprehensive quality checks including linting, type checking, tests, and bundle analysis
parameters:
  runTests:
    type: boolean
    default: true
    description: Run test suite
  checkBundleSize:
    type: boolean
    default: true
    description: Analyze bundle size
  checkOutdated:
    type: boolean
    default: false
    description: Check for outdated dependencies
  fixIssues:
    type: boolean
    default: false
    description: Automatically fix fixable issues
---

# Quality Check Runner

Run comprehensive quality checks to ensure code quality standards.

## Checks

1. **Type Check** - `bun run type-check`
2. **Linting** - `bun run lint`
3. **Tests** - `bun run test:run` (if enabled)
4. **Bundle Analysis** - Analyze build output
5. **Outdated Dependencies** - Check for updates (if enabled)

## Auto-fix

If `fixIssues=true`, automatically fix:
- Linting errors
- Formatting issues
- Some type errors

## Exit Codes

- 0: All checks passed
- 1: Type check failed
- 2: Linting failed
- 3: Tests failed
- 4: Bundle size issues
