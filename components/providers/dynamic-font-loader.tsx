"use client"

import { useEffect, useState } from "react"
import { useThemeConfig } from "@/components/active-theme"
import { getThemeFontUrl, getThemeFont, getFontFamily } from "@/lib/theme-fonts"

// Import the ThemeConfig type to pass to the hook
import type { ThemeType } from "@/lib/themes"

/**
 * Dynamic Font Loader
 * Loads Google Fonts dynamically based on the active theme
 * Only loads fonts that are actually needed, improving performance
 */
export function DynamicFontLoader() {
  const { theme } = useThemeConfig()
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Get the theme preset (e.g., "supabase", "retro-arcade", etc.)
    const currentTheme = theme.preset || "default"
    const fontConfig = getThemeFont(currentTheme)
    const fontUrl = getThemeFontUrl(currentTheme)

    // Only load font if not already loaded
    if (!loadedFonts.has(fontConfig.family)) {
      const link = document.createElement("link")
      link.href = fontUrl
      link.rel = "stylesheet"
      link.dataset.themeFont = currentTheme

      document.head.appendChild(link)

      // Mark font as loaded
      setLoadedFonts(prev => new Set(prev).add(fontConfig.family))

      // Apply font family to CSS variables
      const fontFamily = getFontFamily(currentTheme)

      // Set both --text-family (used by themes.css) and --font-sans (used by Tailwind)
      document.documentElement.style.setProperty("--text-family", fontFamily.split(",")[0])
      document.documentElement.style.setProperty("--font-sans", fontFamily)

      console.log(`🎨 Loaded font: ${fontConfig.family} for theme: ${currentTheme}`)
    }

    // Cleanup function to remove font styles when theme changes
    return () => {
      // Optional: cleanup old theme fonts if needed
    }
  }, [theme.preset, loadedFonts])

  return null
}

/**
 * Hook to get the current theme's font configuration
 */
export function useThemeFont() {
  const { theme } = useThemeConfig()
  const currentTheme = theme.preset || "default"

  return getThemeFont(currentTheme)
}
