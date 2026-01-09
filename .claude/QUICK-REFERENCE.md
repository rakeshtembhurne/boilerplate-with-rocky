# Skills Quick Reference

## Your 10 Custom Skills

```
/setup-testing     - Set up testing infrastructure with Vitest
/gitflow           - Manage Git Flow workflow
/create-plugin     - Create complete plugins with route groups
/generate-crud     - Generate CRUD operations for Prisma models
/check-quality     - Run comprehensive quality checks
/create-component  - Generate UI components with variants
/migrate-db        - Run database migrations safely
/setup-env         - Set up development environment
/setup-cicd        - Generate CI/CD pipelines
/generate-docs     - Generate comprehensive documentation
```

## Quick Start

```bash
# 1. Set environment variable (one-time)
./.claude/setup-skills.sh

# 2. List your skills
/skills-list

# 3. Use any skill
/create-plugin blogging
```

## Important Notes

⚠️ **`/skills` command has a bug** - It won't show your custom skills.
✅ **Use `/skills-list` instead** - This shows all your project skills.

Your skills work fine when invoked directly, they just don't appear in `/skills`.

## Troubleshooting

**Skills not working?**
```bash
# Check environment variable
echo $SLASH_COMMAND_TOOL_CHAR_BUDGET

# Should show: 30000
# If empty, run: ./.claude/setup-skills.sh
```

**Need help?**
- Read: `.claude/TROUBLESHOOTING.md`
- Read: `.claude/SKILLS-SOLUTION.md`

## Skill Examples

```bash
# Create a blogging plugin
/create-plugin blogging --sub-features authors,posts,categories

# Start a feature branch
/gitflow start-feature add-markdown-support

# Run quality checks
/check-quality --run-tests --check-bundle-size

# Generate CRUD for a model
/generate-crud Post --plugin-name blogging

# Create a component
/create-component data-table --component-type compound

# Run database migration
/migrate-db --create-migration --generate-rollback
```

## Documentation

- `.claude/skills/README.md` - Detailed skills guide
- `.claude/TROUBLESHOOTING.md` - Troubleshooting guide
- `.claude/SKILLS-SOLUTION.md` - Complete solution overview

---

**Last Updated:** 2025-01-08
