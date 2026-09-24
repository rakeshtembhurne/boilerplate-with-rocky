import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

const dashboardConfig = read("config/dashboard.ts");
const manifest = read("public/site.webmanifest");
const rootNotFound = read("app/not-found.tsx");
const marketingNotFound = read("app/(marketing)/not-found.tsx");

describe("public assets and dashboard routes", () => {
  test("does not expose the removed posts navigation item", () => {
    expect(dashboardConfig).not.toContain("User Posts");
    expect(dashboardConfig).not.toContain("dashboard/posts");
  });

  test("serves the existing Apple touch assets at browser-requested paths", () => {
    expect(
      existsSync(
        join(new URL(".", root).pathname, "public/apple-touch-icon.png"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        join(
          new URL(".", root).pathname,
          "public/apple-touch-icon-precomposed.png",
        ),
      ),
    ).toBe(true);
    expect(manifest).toContain("/_static/favicons/android-chrome-192x192.png");
    expect(manifest).toContain("/_static/favicons/android-chrome-512x512.png");
  });

  test("loads the above-fold 404 illustration eagerly", () => {
    expect(rootNotFound).toContain('loading="eager"');
    expect(marketingNotFound).toContain('loading="eager"');
  });
});
