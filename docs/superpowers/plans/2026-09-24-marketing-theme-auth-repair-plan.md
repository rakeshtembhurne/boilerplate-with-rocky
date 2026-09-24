# Marketing Layout, Theme, and Email Login Repair Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with a failing check before each production behavior change. Do not commit or merge without explicit user approval.

**Goal:** Repair the duplicated pricing chrome, restore TweakCN-derived theme/font behavior, and add a development-testable email OTP sign-in flow.

**Architecture:** The marketing layout remains the only shared navigation/footer shell. TweakCN preset data remains represented in `styles/themes.css`; the runtime font loader reads one generated, source-backed font map. Better Auth’s existing `emailOTP` plugin is added to the current email/password configuration, with a development-only deterministic OTP.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Better Auth 1.7, Bun, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-24-marketing-theme-auth-repair-design.md`

## Global Constraints

- Use Bun only.
- Do not add an auth dependency.
- Fixed OTP values are development-only.
- Preserve the existing uncommitted `package.json` and `tasks/lessons.md` changes.
- Do not commit or merge without a separate explicit user instruction.

---

### Task 1: Add failing regression checks

**Files:**

- Create: `tests/marketing-structure.test.ts`
- Create: `tests/theme-fonts.test.ts`

**Checks:**

- Pricing source must not contain its own `<header`, `<footer`, or nested `<main>`.
- Pricing source must not contain obsolete `/auth/signin` or `/auth/signup` links.
- Pricing source must use semantic theme classes instead of hardcoded page background/text colors.
- Theme font mapping must return the current TweakCN Violet Bloom roles: Plus Jakarta Sans, Lora, IBM Plex Mono.
- Theme font URL generation must produce a valid Google Fonts URL.

Run: `bun test tests/marketing-structure.test.ts tests/theme-fonts.test.ts`
Expected before implementation: FAIL because the duplicate pricing chrome and incomplete font configuration still exist.

### Task 2: Repair pricing page ownership and theme usage

**Files:**

- Modify: `app/(marketing)/pricing/page.tsx`

**Changes:**

- Remove the page-owned header, nested main, and page-owned footer.
- Use `siteConfig.name` and semantic theme classes.
- Use current auth route paths.
- Preserve responsive plan/FAQ/CTA content with the existing shared header/footer from the layout.

Run: `bun test tests/marketing-structure.test.ts`
Expected: PASS.

### Task 3: Restore source-backed TweakCN font configuration

**Files:**

- Modify: `lib/theme-fonts.ts`
- Modify: `styles/themes.css`
- Modify: `styles/globals.css`
- Modify: `components/providers/dynamic-font-loader.tsx`
- Modify: `components/sections/hero-landing.tsx`
- Modify: `components/layout/dashboard-sidebar.tsx`
- Modify: `components/modals/sign-in-modal.tsx`
- Modify: `lib/theme-presets.generated.ts` (generated)

**Changes:**

- Use the live TweakCN preset font roles for the 42 TweakCN themes.
- Keep a valid global fallback (`Inter, ui-sans-serif, system-ui, sans-serif`).
- Load the active theme’s sans/serif/mono families on demand without preventing CSS variable updates when a family was previously loaded.
- Apply the source-backed `--text-family`, `--font-sans`, `--font-serif`, and `--font-mono` variables.
- Add source-backed theme spacing/letter-spacing variables where TweakCN defines them.
- Replace undefined `font-satoshi` and `font-heading` utilities with the configured font utility.
- Run `bun run themes:generate` after updating `styles/themes.css`.

Run: `bun test tests/theme-fonts.test.ts && bun run themes:check`
Expected: PASS.

### Task 4: Add email OTP sign-in

**Files:**

- Modify: `lib/env.ts`
- Modify: `lib/email.ts`
- Modify: `lib/auth.ts`
- Modify: `lib/auth-client.ts`
- Modify: `components/auth/sign-in-form.tsx`
- Create: `tests/email-otp.test.ts`

**Changes:**

- Add the Better Auth `emailOTP` plugin.
- Send sign-in OTPs through the existing best-effort Resend helper.
- In non-production, generate `EMAIL_OTP_TEST_CODE` or the local default `123456`; production uses random OTP generation.
- Add a compact email-code mode to the sign-in form while retaining password and Google modes.
- Verify email normalization, request errors, invalid-code errors, redirect behavior, and resend/back navigation.
- Do not display or accept the fixed code in production.

Run: `bun test tests/email-otp.test.ts`
Expected before implementation: FAIL because the plugin and helper do not exist; after implementation: PASS.

### Task 5: Full verification

**Commands:**

- `bun test`
- `bun run lint`
- `bun run type-check`
- `bun run build`
- `bun run themes:check`

**Browser QA:**

- `/` and `/pricing` at mobile and desktop widths.
- Exactly one shared navigation and one shared footer on `/pricing`.
- Light and dark theme screenshots.
- `/auth/sign-in` password mode, email-code mode, and error states.
- Pricing CTA routes to `/auth/sign-up` and sign-in routes to `/auth/sign-in`.
- No browser console errors.

Do not claim completion unless all commands and browser checks have fresh passing evidence.
