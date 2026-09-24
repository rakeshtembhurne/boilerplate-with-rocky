"use client";

import { useEffect } from "react";

import {
  getFontStack,
  getThemeFont,
  getThemeFontUrls,
} from "@/lib/theme-fonts";
import { useThemeConfig } from "@/components/active-theme";

// Font stylesheets already injected into the document this session.
const loadedFonts = new Set<string>();

/**
 * Loads the Google Font for the active theme on demand and applies it to
 * `--font-sans` / `--text-family`.
 */
export function DynamicFontLoader() {
  const { theme } = useThemeConfig();

  useEffect(() => {
    const currentTheme = theme.preset || "default";
    const fontUrls = getThemeFontUrls(currentTheme);

    for (const fontUrl of fontUrls) {
      if (loadedFonts.has(fontUrl)) continue;
      loadedFonts.add(fontUrl);

      const link = document.createElement("link");
      link.href = fontUrl;
      link.rel = "stylesheet";
      link.dataset.themeFont = currentTheme;
      document.head.appendChild(link);
    }

    const body = document.body;
    const sans = getFontStack(currentTheme, "sans");
    const serif = getFontStack(currentTheme, "serif");
    const mono = getFontStack(currentTheme, "mono");

    body.style.setProperty("--theme-font-sans", sans);
    body.style.setProperty("--theme-font-serif", serif);
    body.style.setProperty("--theme-font-mono", mono);
    body.style.setProperty("--text-family", sans);
  }, [theme.preset]);

  return null;
}

/**
 * Hook to get the current theme's font configuration.
 */
export function useThemeFont() {
  const { theme } = useThemeConfig();
  return getThemeFont(theme.preset || "default");
}
