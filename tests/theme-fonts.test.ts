import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";

import {
  getFontFamily,
  getThemeFont,
  getThemeFontUrl,
  type ThemeFontConfig,
} from "../lib/theme-fonts";

type SourceThemeFontConfig = ThemeFontConfig & {
  serif: string;
  mono: string;
};

describe("TweakCN theme font configuration", () => {
  test("uses the configured default preset on a fresh browser", async () => {
    const layoutSource = await readFile(
      new URL("../app/layout.tsx", import.meta.url),
      "utf8",
    );

    expect(layoutSource).toContain("siteConfig.theme?.default");
  });

  test("keeps the body on the semantic theme background", async () => {
    const themeSource = await readFile(
      new URL("../styles/themes.css", import.meta.url),
      "utf8",
    );

    expect(themeSource).not.toContain("bg-transparent");
  });
  test("keeps the source-backed font roles for Violet Bloom", () => {
    const config = getThemeFont("violet-bloom") as SourceThemeFontConfig;

    expect(config.family).toBe("Plus Jakarta Sans");
    expect(config.serif).toBe("Lora");
    expect(config.mono).toBe("IBM Plex Mono");
    expect(getFontFamily("violet-bloom")).toBe("Plus Jakarta Sans, sans-serif");
  });

  test("uses the current TweakCN font roles for Modern Minimal", () => {
    const config = getThemeFont("modern-minimal") as SourceThemeFontConfig;

    expect(config.family).toBe("Inter");
    expect(config.serif).toBe("Source Serif 4");
    expect(config.mono).toBe("JetBrains Mono");
  });

  test("builds a valid Google Fonts URL for the active theme", () => {
    expect(getThemeFontUrl("violet-bloom")).toBe(
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
    );
  });
});
