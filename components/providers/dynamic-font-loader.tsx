"use client"

import { useEffect } from "react"
import { useThemeConfig } from "@/components/active-theme"
import { getThemeFontUrl, getThemeFont, getFontFamily } from "@/lib/theme-fonts"

// Fonts already injected into the document this session.
const loadedFonts = new Set<string>()

/**
 * Loads the Google Font for the active theme on demand and applies it to
 * `--font-sans` / `--text-family`.
 */
export function DynamicFontLoader() {
  const { theme } = useThemeConfig()

  useEffect(() => {
    const currentTheme = theme.preset || "default"
    const fontConfig = getThemeFont(currentTheme)

    if (loadedFonts.has(fontConfig.family)) return
    loadedFonts.add(fontConfig.family)

    const link = document.createElement("link")
    link.href = getThemeFontUrl(currentTheme)
    link.rel = "stylesheet"
    link.dataset.themeFont = currentTheme
    document.head.appendChild(link)

    const fontFamily = getFontFamily(currentTheme)
    document.documentElement.style.setProperty(
      "--text-family",
      fontFamily.split(",")[0],
    )
    document.documentElement.style.setProperty("--font-sans", fontFamily)
  }, [theme.preset])

  return null
}

/**
 * Hook to get the current theme's font configuration.
 */
export function useThemeFont() {
  const { theme } = useThemeConfig()
  return getThemeFont(theme.preset || "default")
}
