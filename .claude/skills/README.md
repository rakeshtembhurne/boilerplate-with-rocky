# Claude Code Skills

This directory contains Claude Code skills (slash commands) for accelerating development in this Next.js 16 enterprise boilerplate.

## Available Skills

### Phase 1: Foundation Skills

#### `/setup-testing`
Set up complete testing infrastructure with Vitest, React Testing Library, and pre-commit hooks.

**Impact:** Critical - fills testing gap
**Usage:**
```bash
/setup-testing --testing-framework vitest --include-examples --setup-coverage
```

**What it does:**
- Installs Vitest and testing libraries
- Creates vitest.config.ts
- Sets up test utilities and mocks
- Adds test scripts to package.json
- Creates example tests
- Configures coverage reporting
- Sets up pre-commit hooks

---

#### `/check-quality`
Run comprehensive quality checks including linting, type checking, tests, and bundle analysis.

**Impact:** Medium - ensures code quality
**Usage:**
```bash
/check-quality --run-tests --check-bundle-size
```

**What it does:**
- Runs TypeScript type-check
- Runs ESLint
- Checks code formatting
- Runs tests (if enabled)
- Analyzes bundle size
- Checks for security vulnerabilities
- Generates quality report

---

#### `/gitflow`
Manage Git Flow workflow with automated quality checks and commit message validation.

**Impact:** High - enforces consistent workflow
**Usage:**
```bash
/gitflow start-feature add-markdown-support
/gitflow finish-feature add-markdown-support
/gitflow start-release 1.2.3
/gitflow finish-release 1.2.3
/gitflow start-hotfix fix-auth-bug
/gitflow finish-hotfix fix-auth-bug
/gitflow status
```

**What it does:**
- Creates feature/release/hotfix branches
- Runs quality checks before merging
- Validates Google commit message format
- Merges with --no-ff flag
- Tags releases
- Manages branch lifecycle

---

### Phase 2: High-Impact Automation

#### `/create-plugin`
Create a complete plugin with route groups, sub-features, pages, API routes, and navigation integration.

**Impact:** **HIGHEST** - reduces plugin creation from 30+ steps to 1 command
**Usage:**
```bash
/create-plugin blogging --sub-features authors,posts,categories --add-prisma-models --run-migrations
```

**What it does:**
- Creates route group structure `(plugin-name)/`
- Generates sub-features with full CRUD
- Creates server and client API
- Generates API routes
- Builds pages (list, create, edit)
- Creates form and table components
- Updates navigation
- Optionally adds Prisma models
- Runs migrations

**Example Output:**
```
app/(protected)/(blogging)/
├── authors/
│   ├── _components/
│   ├── _lib/
│   ├── _types/
│   ├── _validations/
│   ├── page.tsx
│   ├── create/page.tsx
│   └── [id]/edit/page.tsx
└── posts/
    └── (similar structure)
```

---

#### `/generate-crud`
Generate complete CRUD operations for an existing Prisma model.

**Impact:** High - eliminates repetitive code
**Usage:**
```bash
/generate-crud Post --plugin-name blogging --generate-tests
```

**What it does:**
- Analyzes Prisma model
- Generates server API functions
- Creates client API wrapper
- Builds REST API routes
- Generates pages (list, create, edit)
- Creates form and table components
- Generates validation schemas
- Updates navigation

---

#### `/create-component`
Generate a new UI component with TypeScript, variants, and documentation.

**Impact:** Medium - accelerates UI development
**Usage:**
```bash
/create-component data-table --component-type compound --with-variants
```

**What it does:**
- Generates component with proper types
- Adds variants using CVA
- Creates compound components
- Includes accessibility features
- Generates tests (optional)
- Creates documentation

---

### Phase 3: Enhanced Operations

#### `/migrate-db`
Run database migrations safely with checks and rollback support.

**Impact:** Medium - simplifies schema changes
**Usage:**
```bash
/migrate-db --create-migration --generate-rollback --regenerate-client
```

**What it does:**
- Checks git status for clean state
- Reviews schema changes
- Creates and applies migration
- Generates rollback script
- Regenerates Prisma client
- Runs seed data (optional)
- Verifies migration

---

#### `/setup-env`
Set up development environment with all prerequisites, dependencies, and configuration.

**Impact:** Low (one-time) - reduces onboarding friction
**Usage:**
```bash
/setup-env --generate-secrets --initialize-database --setup-git-hooks
```

**What it does:**
- Checks prerequisites (Bun, PostgreSQL, Podman)
- Installs dependencies
- Creates .env.local with secrets
- Prompts for configuration
- Initializes database
- Sets up Git hooks
- Runs quality checks

---

#### `/setup-cicd`
Generate CI/CD pipeline configuration for GitHub Actions with quality checks and deployment.

**Impact:** Low - professional deployment
**Usage:**
```bash
/setup-cicd --platform github --enable-container-build --enable-deployment --deployment-target vercel
```

**What it does:**
- Creates GitHub Actions workflows
- Sets up CI job (test, lint, type-check, build)
- Configures CD job (build container, deploy)
- Documents required secrets
- Creates PR and issue templates
- Configures branch protection rules

---

#### `/generate-docs`
Generate comprehensive documentation for plugins, components, API routes, and architecture.

**Impact:** Low - knowledge sharing
**Usage:**
```bash
/generate-docs --target all --format markdown --include-examples
```

**What it does:**
- Scans plugins, components, API routes
- Generates structured documentation
- Creates API reference
- Generates component documentation
- Builds architecture docs
- Includes code examples

---

## Skill Architecture

Each skill follows this structure:

```
.claude/skills/{skill-name}/
├── skill.json           # Metadata and parameters
└── instructions.md      # Implementation guide
```

### skill.json

Defines the skill interface:
- `name` - Skill identifier
- `description` - What the skill does
- `parameters` - Configuration options with types and defaults

### instructions.md

Contains detailed instructions for:
- Context about the codebase
- Step-by-step implementation
- Code patterns to follow
- Integration points
- Examples and usage
- Best practices

## Usage Patterns

### Initial Setup

1. **First time setup:**
   ```bash
   /setup-env                    # Set up environment
   /setup-testing                # Add testing
   /setup-cicd                   # Configure CI/CD
   ```

2. **Starting a new feature:**
   ```bash
   /gitflow start-feature name   # Create branch
   /create-plugin name           # Build plugin
   /generate-crud Model          # Add CRUD
   /check-quality                # Verify quality
   /gitflow finish-feature name  # Merge to develop
   ```

3. **Database changes:**
   ```bash
   # Edit prisma/schema.prisma
   /migrate-db                   # Apply migration
   /generate-docs --target api   # Update docs
   ```

4. **Creating components:**
   ```bash
   /create-component name        # Generate component
   /check-quality                # Verify
   ```

5. **Release time:**
   ```bash
   /gitflow start-release 1.2.3  # Create release branch
   /check-quality                # Verify all checks
   /gitflow finish-release 1.2.3 # Merge and tag
   ```

## Integration

Skills work together:

- `/create-plugin` uses components from `/create-component`
- `/gitflow` runs `/check-quality` before merging
- `/migrate-db` updates schema used by `/generate-crud`
- `/generate-docs` documents everything
- `/setup-testing` creates tests for all generated code

## Best Practices

1. **Run quality checks often:**
   ```bash
   /check-quality  # Before committing
   ```

2. **Follow Git Flow:**
   ```bash
   /gitflow start-feature name
   # Do work
   /gitflow finish-feature name
   ```

3. **Use plugins for features:**
   ```bash
   /create-plugin blogging  # Not manual creation
   ```

4. **Keep docs updated:**
   ```bash
   /generate-docs  # After changes
   ```

5. **Test before merging:**
   ```bash
   /check-quality  # Always
   ```

## File Locations

Skills operate on:
- `app/(protected)/` - Plugin pages
- `app/api/` - API routes
- `components/` - UI components
- `lib/` - Utilities
- `prisma/` - Database
- `config/` - Configuration

## Contributing

To add a new skill:

1. Create directory: `.claude/skills/{skill-name}/`
2. Add `skill.json` with metadata
3. Add `instructions.md` with implementation
4. Test thoroughly
5. Update this README

## Troubleshooting

### Skills Not Appearing in `/skills` Command

**This is a known bug** - The `/skills` command only shows built-in Claude Code skills, not user-provided skills from `.claude/skills/`.

**Workaround:**
- Use skills directly by typing `/skill-name`
- Run `/skills-list` to see all project skills
- See `.claude/TROUBLESHOOTING.md` for detailed information

**References:**
- [GitHub Issue #14733](https://github.com/anthropics/claude-code/issues/14733)
- [GitHub Issue #14577](https://github.com/anthropics/claude-code/issues/14577)

### Skills Not Triggering

If Claude doesn't use skills when invoked, you may have exceeded the character budget for skill descriptions.

**Solution:**
```bash
# Increase the character budget
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000

# Add to ~/.zshrc for permanent fix
echo 'export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000' >> ~/.zshrc
```

See `.claude/TROUBLESHOOTING.md` for complete troubleshooting guide.

## Support

For issues or questions:
- Check `.claude/TROUBLESHOOTING.md` for common issues
- Check skill's `instructions.md` for implementation details
- Review CLAUDE.md for codebase patterns
- Check README.md for project docs

---

**Built with ❤️ for Next.js 16, Prisma 7, and betterAuth**
