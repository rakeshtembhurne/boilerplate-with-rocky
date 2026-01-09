---
description: Generate CI/CD pipeline configuration for GitHub Actions with quality checks and deployment
parameters:
  platform:
    type: string
    enum: ["github", "gitlab", "vercel"]
    default: github
    description: CI/CD platform to configure
  enableContainerBuild:
    type: boolean
    default: true
    description: Add container build step
  enableDeployment:
    type: boolean
    default: false
    description: Add deployment step
  deploymentTarget:
    type: string
    enum: ["vercel", "aws", "digitalocean", "self-hosted"]
    description: Deployment target (if enableDeployment=true)
---

# CI/CD Pipeline Generator

Generate complete CI/CD configuration.

## Features

- Quality checks (test, lint, type-check, build)
- Container build (if enabled)
- Deployment (if enabled)
- PR templates
- Branch protection rules

## Platforms

- **GitHub Actions** - `.github/workflows/`
- **GitLab CI** - `.gitlab-ci.yml`
- **Vercel** - Configuration via dashboard

## Example

```bash
/setup-cicd --platform github --enable-container-build
```
