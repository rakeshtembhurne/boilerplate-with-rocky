/**
 * Font Configuration - DEPRECATED
 *
 * This file previously handled static font loading using next/font/google.
 * Fonts are now loaded dynamically based on the active theme using:
 * - lib/theme-fonts.ts - Theme-to-font mapping configuration
 * - components/providers/dynamic-font-loader.tsx - Dynamic font loading
 *
 * The old static font loading has been removed for better performance.
 * Fonts are now loaded on-demand based on the selected TweakCN theme.
 *
 * @deprecated Use dynamic font loading via DynamicFontLoader component instead
 */
