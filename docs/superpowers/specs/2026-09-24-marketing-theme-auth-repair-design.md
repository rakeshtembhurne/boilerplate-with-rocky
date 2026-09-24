# Marketing Layout, Theme, and Email Login Repair Design

**Date:** 2026-09-24
**Status:** Approved by user

## Goal

Restore the marketing/pricing pages to one shared navigation/footer shell, make theme and font behavior consistent in light/dark mode, and add a development-testable email-code sign-in flow without removing existing email/password or Google login.

## Root causes

1. The marketing layout renders shared navigation/footer chrome, while `/pricing` renders a second header/footer inside its page.
2. `/pricing` bypasses semantic theme tokens with hardcoded light backgrounds and colors, so it does not respond correctly to dark mode.
3. Pricing auth CTAs use obsolete `/auth/signin` and `/auth/signup` routes instead of the current `/auth/sign-in` and `/auth/sign-up` routes.
4. The global font contract references undefined font variables and the app uses undefined `font-satoshi` utilities, making typography dependent on fallback behavior.
5. Better Auth has email/password sign-in but no email OTP sign-in UI or server plugin configuration.

## Design

- Keep `app/(marketing)/layout.tsx` as the sole owner of `NavMobile`, `NavBar`, `SiteFooter`, and the page `main` boundary.
- Rewrite the pricing page as content-only sections using `siteConfig`, existing marketing configuration where practical, semantic tokens (`background`, `foreground`, `card`, `muted`, `primary`, `border`), and responsive layout classes.
- Keep the existing marketing font theme system, but give it a valid fallback chain and apply the active font consistently. Replace undefined `font-satoshi` utilities with the configured font utility.
- Add Better Auth `emailOTP` with a `sendVerificationOTP` callback. In development, use `EMAIL_OTP_TEST_CODE` when provided, otherwise the documented local default `123456`; production always uses random OTP generation. Email delivery remains best-effort through the existing Resend helper and the OTP is logged for local testing.
- Add a compact email-code mode to the existing sign-in form while retaining password mode and Google mode.
- Verify with Bun tests where logic is extracted, then lint, type-check, build, and Playwright browser QA in both themes and responsive widths.

## Constraints

- Use Bun only.
- Do not add a new auth dependency; Better Auth already includes `emailOTP`.
- Do not accept fixed OTPs in production.
- Do not change the existing uncommitted `package.json` or `tasks/lessons.md` changes.
- Do not commit or merge without a separate explicit user instruction.
