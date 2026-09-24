# Boilerplate v2 — Implementation Plan

Spec: `docs/superpowers/specs/2026-09-24-boilerplate-v2-design.md`
Branch: `feature/boilerplate-v2` → merge to `develop`

## Progress

- [x] Phase 0 — Setup (branch off develop)
- [x] Phase 1 — Dependency & framework upgrade (Next 16.3, React 19.3, better-auth 1.7, Tailwind 4.3, ESLint 9 flat config, lib/env.ts)
- [x] Phase 2 — Aggressive cleanup (dead code, ~35 deps, scripts, contentlayer, secret scrub)
- [x] Phase 3 — Prisma 7 + Turso libSQL; auth hardening; complete reset/verify flows
- [x] Phase 4 — Generic `items` CRUD plugin (replaces products + logos)
- [x] Phase 5 — Theming single source of truth (generated registry, 62 presets)
- [x] Phase 6 — Next 16 conventions (proxy.ts, route segment cleanup)
- [x] Phase 7 — Deployment (Containerfile, compose, CI, husky, env templates)
- [x] Phase 8 — Docs + branding (README, CLAUDE.md, AGENTS.md, Acme rebrand)
- [ ] Phase 9 — Final verification + visual QA + merge to develop

## Deviations from spec

- **zod kept at 3.23.8** (not upgraded to 4) to avoid broad breaking changes; no app dependency requires zod 4.
- **`cacheComponents` not enabled.** Enabling it globally conflicts with the
  cookie-driven root layout and every auth-gated route (all need Suspense
  boundaries), so it is documented as an opt-in rather than shipped half-broken.
- **`scripts/` generator added** for themes (was not in the original plan).

## Verification evidence

| Check                                 | Result                                   |
| ------------------------------------- | ---------------------------------------- |
| `bun run type-check`                  | clean                                    |
| `bun run lint`                        | 0 errors (warnings only)                 |
| `bun run build`                       | succeeds (22 routes)                     |
| `bun run themes:check`                | up to date                               |
| `GET /api/health` (prod)              | 200, database connected                  |
| Standalone server (container runtime) | health 200, home 200                     |
| Container image build                 | not run (no Docker/Podman daemon in env) |
| Visual QA                             | screenshots of landing/auth/pricing      |
