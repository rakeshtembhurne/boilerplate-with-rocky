---
description: Generate comprehensive documentation for plugins, components, API routes, and architecture
parameters:
  target:
    type: string
    enum: ["all", "plugins", "components", "api", "architecture"]
    default: all
    description: What to generate documentation for
  format:
    type: string
    enum: ["markdown", "json", "html"]
    default: markdown
    description: Output format
  includeExamples:
    type: boolean
    default: true
    description: Include code examples
  outputPath:
    type: string
    default: docs
    description: Directory to output documentation
---

# Documentation Generator

Generate comprehensive documentation from code.

## Targets

- **all**: Generate all documentation
- **plugins**: Document all plugins
- **components**: Document UI components
- **api**: Document API routes
- **architecture**: Architecture documentation

## Features

- Auto-generates from code structure
- Includes usage examples
- Creates API reference
- Generates component docs

## Example

```bash
/generate-docs --target plugins --format markdown
```
