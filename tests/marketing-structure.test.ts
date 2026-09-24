import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";

const pricingSource = await readFile(
  new URL("../app/(marketing)/pricing/page.tsx", import.meta.url),
  "utf8",
);

describe("marketing pricing structure", () => {
  test("uses the shared marketing chrome instead of rendering a second shell", () => {
    expect(pricingSource).not.toMatch(/<header\b/);
    expect(pricingSource).not.toMatch(/<footer\b/);
    expect(pricingSource).not.toMatch(/<main\b/);
  });

  test("uses current auth routes", () => {
    expect(pricingSource).not.toContain("/auth/signin");
    expect(pricingSource).not.toContain("/auth/signup");
    expect(pricingSource).toContain("/auth/sign-in");
    expect(pricingSource).toContain("/auth/sign-up");
  });

  test("uses semantic theme classes for page surfaces", () => {
    expect(pricingSource).not.toMatch(/bg-(?:white|slate-50|violet|green)-\d+/);
    expect(pricingSource).not.toMatch(/text-(?:white|violet|green)-\d+/);
    expect(pricingSource).toContain("bg-background");
    expect(pricingSource).toContain("text-foreground");
  });
});
