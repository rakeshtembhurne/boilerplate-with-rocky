# Skills List

**Lists all available custom skills in this project**

## Available Skills

This project has 10 custom skills defined in `.claude/skills/`:

### Setup & Configuration
- **setup-testing** - Set up testing infrastructure with Vitest
- **setup-env** - Configure development environment
- **setup-cicd** - Generate CI/CD pipelines

### Development
- **create-plugin** - Create complete plugins with route groups
- **generate-crud** - Generate CRUD operations for Prisma models
- **create-component** - Generate UI components with variants

### Quality & Workflow
- **gitflow** - Manage Git Flow workflow
- **check-quality** - Run comprehensive quality checks
- **migrate-db** - Run database migrations safely

### Documentation
- **generate-docs** - Generate comprehensive documentation

## Usage

Invoke any skill by typing:
```
/skill-name
```

For example:
```
/setup-testing
/create-plugin blogging
/gitflow start-feature new-auth
```

## Detailed Documentation

See `.claude/skills/README.md` for detailed usage of each skill.

## Troubleshooting

If skills don't appear in `/skills` command, this is a known bug. Use the individual skill commands directly - they work even if not listed.

For more info, see: `.claude/TROUBLESHOOTING.md`
