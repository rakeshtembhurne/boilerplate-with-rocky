/**
 * Theme Font Configuration
 *
 * Maps each theme to its recommended Google Font
 * Font configurations are based on TweakCN (https://tweakcn.com)
 * Fonts are loaded dynamically based on the active theme
 */

export interface ThemeFontConfig {
  family: string;
  weights: number[];
  display: 'swap' | 'optional' | 'fallback' | 'block';
}

/**
 * Complete theme-to-font mapping
 * Themes from TweakCN use exact fonts from their configuration
 * Custom themes (not in TweakCN) use sensible defaults
 */
export const THEME_FONTS: Record<string, ThemeFontConfig> = {
  // TweakCN themes with exact font configurations
  "amber-minimal": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "amethyst-haze": {
    family: "Geist",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "bold-tech": {
    family: "Roboto",
    weights: [400, 500, 700],
    display: "swap"
  },
  "clean-slate": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "cosmic-night": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "elegant-luxury": {
    family: "Poppins",
    weights: [400, 500, 600],
    display: "swap"
  },
  "kodama-grove": {
    family: "Merriweather",
    weights: [300, 400, 700],
    display: "swap"
  },
  "midnight-bloom": {
    family: "Montserrat",
    weights: [400, 500, 600],
    display: "swap"
  },
  "mocha-mousse": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap"
  },
  "modern-minimal": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "neo-brutalism": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap"
  },
  "northern-lights": {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700, 800],
    display: "swap"
  },
  "ocean-breeze": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap"
  },
  "pastel-dreams": {
    family: "Open Sans",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "quantum-rose": {
    family: "Poppins",
    weights: [400, 500, 600],
    display: "swap"
  },
  "retro-arcade": {
    family: "Outfit",
    weights: [300, 400, 500, 600, 700],
    display: "swap"
  },
  "sage-garden": {
    family: "Antic",
    weights: [400],
    display: "swap"
  },
  "soft-pop": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap"
  },
  "solar-dusk": {
    family: "Oxanium",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "starry-night": {
    family: "Libre Baskerville",
    weights: [400, 700],
    display: "swap"
  },
  "sunset-horizon": {
    family: "Montserrat",
    weights: [400, 500, 600],
    display: "swap"
  },
  "t3-chat": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  // Additional TweakCN themes (unquoted keys in original)
  "bubblegum": {
    family: "Poppins",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "candyland": {
    family: "Poppins",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "catppuccin": {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "claymorphism": {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "cyberpunk": {
    family: "Outfit",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "darkmatter": {
    family: "Geist Mono",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "graphite": {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "mono": {
    family: "Geist Mono",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "nature": {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "notebook": {
    family: "Architects Daughter",
    weights: [400],
    display: "swap"
  },
  "perpetuity": {
    family: "Courier New",
    weights: [400],
    display: "swap"
  },
  "vintage-paper": {
    family: "Libre Baskerville",
    weights: [400, 700],
    display: "swap"
  },
  "violet-bloom": {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700, 800],
    display: "swap"
  },

  // Additional TweakCN themes (unquoted keys in original)
  "supabase": {
    family: "Outfit",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "tangerine": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "twitter": {
    family: "Open Sans",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "vercel": {
    family: "Geist",
    weights: [400, 500, 600, 700],
    display: "swap"
  },
  "claude": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  },

  // Default fallback
  "default": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap"
  }
} as const;

/**
 * Get font configuration for a specific theme
 */
export function getThemeFont(themeValue: string): ThemeFontConfig {
  return THEME_FONTS[themeValue] || THEME_FONTS.default;
}

/**
 * Get Google Fonts URL for a specific theme
 */
export function getThemeFontUrl(themeValue: string): string {
  const fontConfig = getThemeFont(themeValue);
  const weights = fontConfig.weights.join(";"); // Google Fonts API v2 uses semicolons

  return `https://fonts.googleapis.com/css2?family=${fontConfig.family.replace(/\s/g, '+')}:wght@${weights}&display=${fontConfig.display}`;
}

/**
 * Get font family name for CSS
 * Returns format like "Inter, sans-serif" or "Merriweather, serif"
 */
export function getFontFamily(themeValue: string): string {
  const fontConfig = getThemeFont(themeValue);

  // Determine font type based on font family
  const serifFonts = ["Merriweather", "Libre Baskerville", "Lora", "Playfair Display"];
  const monoFonts = ["JetBrains Mono", "Fira Code", "Source Code Pro", "Space Mono", "Geist Mono", "Courier New"];

  if (monoFonts.includes(fontConfig.family)) {
    return `${fontConfig.family}, monospace`;
  } else if (serifFonts.includes(fontConfig.family)) {
    return `${fontConfig.family}, serif`;
  } else {
    return `${fontConfig.family}, sans-serif`;
  }
}
