# Boilerplate v2 — Implementation Plan

Spec: `docs/superpowers/specs/2026-09-24-boilerplate-v2-design.md`
Branch: `feature/boilerplate-v2` → merge to `develop`

Verification gate before each phase is marked complete: `bun run type-check`
and `bun run build` pass, plus the phase-specific check noted.

## Phase 0 — Setup
- [x] Branch `feature/boilerplate-v2` off `develop`
- [ ] Re-verify develop baseline (`type-check`, `build`)

## Phase 1 — Dependency & framework upgrade
- [ ] Upgrade next/react/react-dom/prisma/@prisma/client/@prisma/adapter-libsql/@libsql/client/better-auth/tailwind/next-themes/zod
- [ ] Remove @vercel/og, vinext+vite toolchain, @t3-oss/env-nextjs
- [ ] Add `lib/env.ts` (fail-fast required vars)
- [ ] Green `type-check` + `build`
- [ ] Commit: `feat(deps): upgrade to Next 16.3, React 19.3, Prisma 7, better-auth 1.7`

## Phase 2 — Aggressive cleanup (ponytail)
- [ ] Delete test scripts, setup.mjs, package-lock.json, duplicate ignore, contentlayer
- [ ] Delete dead modules/hooks/configs/assets
- [ ] Remove unused deps + unused ui components
- [ ] Fix `.nvmrc`
- [ ] `type-check` + `build` green
- [ ] Commit: `refactor: remove dead code, unused deps, and throwaway scripts`

## Phase 3 — Database (Turso) + auth correctness
- [ ] `prisma.config.ts`, schema generator/datasource, `lib/db.ts` libsql adapter
- [ ] Migration + seed; untrack `prisma/dev.db`
- [ ] Fix auth trustedOrigins/baseURL/requireEmailVerification
- [ ] Fix role escalation; enforce ADMIN-only
- [ ] Complete reset-password + verify-email flows (Resend no-op fallback)
- [ ] Consolidate next-auth-compat
- [ ] Commit(s)

## Phase 4 — Generic `items` plugin
- [ ] Delete products + logos scaffolds
- [ ] Build `items` plugin (types, validation, server/api client, routes, pages)
- [ ] Dashboard nav
- [ ] Commit: `feat(items): add generic CRUD exemplar plugin`

## Phase 5 — Theming single source of truth + TweakCN refresh
- [ ] Derive typed registry from themes.css; consolidate fonts
- [ ] Fix active-theme cookie bug, sidebar hsl bug, components.json
- [ ] Refresh TweakCN presets
- [ ] Commit: `refactor(theme): single source of truth + refreshed presets`

## Phase 6 — Next 16 features
- [ ] proxy.ts migration
- [ ] cacheComponents + "use cache"/cacheTag + revalidateTag
- [ ] next/og rebrand, generateMetadata, siteConfig.url fallback
- [ ] Commit

## Phase 7 — Deployment
- [ ] Containerfile + compose + Makefile
- [ ] CI workflow + husky
- [ ] Env templates; scrub secrets
- [ ] Verify container build + /api/health
- [ ] Commit

## Phase 8 — Docs + branding + visual QA
- [ ] README rewrite; AGENTS.md; CLAUDE.md refresh; .mcp.json key removed
- [ ] Package rename; rebrand stale strings
- [ ] Visual QA landing/auth/dashboard (light/dark + presets)
- [ ] Commit

## Phase 9 — Verify & merge
- [ ] End-to-end verification with evidence
- [ ] `git checkout develop && git merge --no-ff feature/boilerplate-v2`
