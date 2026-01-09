---
description: Generate a new UI component with TypeScript, variants, and documentation
parameters:
  componentName:
    type: string
    description: Name of the component (e.g., 'alert-dialog', 'data-table')
  componentType:
    type: string
    enum: ["basic", "compound", "form", "layout"]
    default: basic
    description: Type of component to create
  withVariants:
    type: boolean
    default: true
    description: Add variants using class-variance-authority
  withTests:
    type: boolean
    default: false
    description: Generate test file
  location:
    type: string
    default: components/ui
    description: Directory to create component in
---

# Component Generator

Generate UI components following shadcn/ui patterns.

## Types

- **basic**: Simple standalone component
- **compound**: Component with multiple sub-components
- **form**: Form input component
- **layout**: Layout/structural component

## Features

- TypeScript with proper types
- Variants using CVA (if enabled)
- Accessibility features
- Storybook-style documentation
- Optional tests

## Example

```bash
/create-component data-table --component-type compound --with-variants
```
