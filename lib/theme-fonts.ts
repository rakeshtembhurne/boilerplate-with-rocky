/**
 * Theme Font Configuration
 *
 * Maps each theme to its recommended Google Font
 * Font configurations are based on TweakCN (https://tweakcn.com)
 * Fonts are loaded dynamically based on the active theme
 */

export interface ThemeFontConfig {
  family: string;
  serif: string;
  mono: string;
  weights: number[];
  display: "swap" | "optional" | "fallback" | "block";
}

type ThemeFontBaseConfig = Omit<ThemeFontConfig, "serif" | "mono">;

/**
 * Complete theme-to-font mapping
 * Themes from TweakCN use exact fonts from their configuration
 * Custom themes (not in TweakCN) use sensible defaults
 */
export const THEME_FONTS: Record<string, ThemeFontBaseConfig> = {
  // TweakCN themes with exact font configurations
  "amber-minimal": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "amethyst-haze": {
    family: "Geist",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "bold-tech": {
    family: "Roboto",
    weights: [400, 500, 700],
    display: "swap",
  },
  "clean-slate": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "cosmic-night": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "elegant-luxury": {
    family: "Poppins",
    weights: [400, 500, 600],
    display: "swap",
  },
  "kodama-grove": {
    family: "Merriweather",
    weights: [300, 400, 700],
    display: "swap",
  },
  "midnight-bloom": {
    family: "Montserrat",
    weights: [400, 500, 600],
    display: "swap",
  },
  "mocha-mousse": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap",
  },
  "modern-minimal": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "neo-brutalism": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap",
  },
  "northern-lights": {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700, 800],
    display: "swap",
  },
  "ocean-breeze": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap",
  },
  "pastel-dreams": {
    family: "Open Sans",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "quantum-rose": {
    family: "Poppins",
    weights: [400, 500, 600],
    display: "swap",
  },
  "retro-arcade": {
    family: "Outfit",
    weights: [300, 400, 500, 600, 700],
    display: "swap",
  },
  "sage-garden": {
    family: "Antic",
    weights: [400],
    display: "swap",
  },
  "soft-pop": {
    family: "DM Sans",
    weights: [400, 500, 700],
    display: "swap",
  },
  "solar-dusk": {
    family: "Oxanium",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  "starry-night": {
    family: "Libre Baskerville",
    weights: [400, 700],
    display: "swap",
  },
  "sunset-horizon": {
    family: "Montserrat",
    weights: [400, 500, 600],
    display: "swap",
  },
  "t3-chat": {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  // Additional TweakCN themes (unquoted keys in original)
  bubblegum: {
    family: "Poppins",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  candyland: {
    family: "Poppins",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  catppuccin: {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  claymorphism: {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  cyberpunk: {
    family: "Outfit",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  darkmatter: {
    family: "Geist Mono",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  graphite: {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  mono: {
    family: "Geist Mono",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  nature: {
    family: "Montserrat",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  notebook: {
    family: "Architects Daughter",
    weights: [400],
    display: "swap",
  },
  perpetuity: {
    family: "Courier New",
    weights: [400],
    display: "swap",
  },
  "vintage-paper": {
    family: "Libre Baskerville",
    weights: [400, 700],
    display: "swap",
  },
  "violet-bloom": {
    family: "Plus Jakarta Sans",
    weights: [400, 500, 600, 700, 800],
    display: "swap",
  },

  // Additional TweakCN themes (unquoted keys in original)
  supabase: {
    family: "Outfit",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  tangerine: {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  twitter: {
    family: "Open Sans",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  vercel: {
    family: "Geist",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
  claude: {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },

  // Default fallback
  default: {
    family: "Inter",
    weights: [400, 500, 600, 700],
    display: "swap",
  },
} as const;

// Font roles copied from the current TweakCN default preset data. The project
// previously kept only the sans mapping, which left serif/mono utilities tied
// to undefined variables.
const THEME_FONT_ROLES: Record<
  string,
  Pick<ThemeFontConfig, "serif" | "mono">
> = {
  "modern-minimal": { serif: "Source Serif 4", mono: "JetBrains Mono" },
  "violet-bloom": { serif: "Lora", mono: "IBM Plex Mono" },
  twitter: { serif: "Georgia", mono: "Menlo" },
  "mocha-mousse": { serif: "Georgia", mono: "Menlo" },
  bubblegum: { serif: "Lora", mono: "Fira Code" },
  "amethyst-haze": { serif: "Lora", mono: "Fira Code" },
  notebook: { serif: "Times New Roman", mono: "Courier New" },
  "doom-64": { serif: "Georgia", mono: "Source Code Pro" },
  catppuccin: { serif: "Georgia", mono: "Fira Code" },
  graphite: { serif: "Georgia", mono: "Fira Code" },
  perpetuity: { serif: "Courier New", mono: "Courier New" },
  "kodama-grove": { serif: "Source Serif 4", mono: "JetBrains Mono" },
  "cosmic-night": { serif: "Georgia", mono: "JetBrains Mono" },
  tangerine: { serif: "Source Serif 4", mono: "JetBrains Mono" },
  "quantum-rose": { serif: "Playfair Display", mono: "Space Mono" },
  nature: { serif: "Merriweather", mono: "Source Code Pro" },
  "bold-tech": { serif: "Playfair Display", mono: "Fira Code" },
  "elegant-luxury": { serif: "Libre Baskerville", mono: "IBM Plex Mono" },
  "amber-minimal": { serif: "Source Serif 4", mono: "JetBrains Mono" },
  supabase: { serif: "Georgia", mono: "monospace" },
  "neo-brutalism": { serif: "Georgia", mono: "Space Mono" },
  "solar-dusk": { serif: "Merriweather", mono: "Fira Code" },
  claymorphism: { serif: "Lora", mono: "Roboto Mono" },
  cyberpunk: { serif: "Georgia", mono: "Fira Code" },
  "pastel-dreams": { serif: "Source Serif 4", mono: "IBM Plex Mono" },
  "clean-slate": { serif: "Merriweather", mono: "JetBrains Mono" },
  caffeine: { serif: "Source Serif 4", mono: "JetBrains Mono" },
  "ocean-breeze": { serif: "Lora", mono: "IBM Plex Mono" },
  "retro-arcade": { serif: "Georgia", mono: "Space Mono" },
  "midnight-bloom": { serif: "Playfair Display", mono: "Source Code Pro" },
  candyland: { serif: "Lora", mono: "Roboto Mono" },
  "northern-lights": { serif: "Source Serif 4", mono: "IBM Plex Mono" },
  "vintage-paper": { serif: "Lora", mono: "IBM Plex Mono" },
  "sunset-horizon": { serif: "Merriweather", mono: "Ubuntu Mono" },
  "starry-night": { serif: "Lora", mono: "IBM Plex Mono" },
  claude: { serif: "Source Serif 4", mono: "JetBrains Mono" },
  vercel: { serif: "Georgia", mono: "Geist Mono" },
  darkmatter: { serif: "Georgia", mono: "JetBrains Mono" },
  mono: { serif: "Geist Mono", mono: "Geist Mono" },
  "soft-pop": { serif: "DM Sans", mono: "Space Mono" },
  "sage-garden": { serif: "Signifier", mono: "JetBrains Mono" },
  default: { serif: "Source Serif 4", mono: "JetBrains Mono" },
};

export function getThemeFont(themeValue: string): ThemeFontConfig {
  const base = THEME_FONTS[themeValue] ?? THEME_FONTS.default;
  return {
    ...base,
    ...(THEME_FONT_ROLES[themeValue] ?? THEME_FONT_ROLES.default),
  };
}

export function getThemeFontUrl(themeValue: string): string {
  const fontConfig = getThemeFont(themeValue);
  return getGoogleFontUrl(
    fontConfig.family,
    fontConfig.weights,
    fontConfig.display,
  );
}

export function getThemeFontUrls(themeValue: string): string[] {
  const fontConfig = getThemeFont(themeValue);
  const families = [fontConfig.family, fontConfig.serif, fontConfig.mono];

  return [...new Set(families)].map((family) =>
    getGoogleFontUrl(family, [400, 500, 600, 700], fontConfig.display),
  );
}

export function getFontStack(
  themeValue: string,
  role: "sans" | "serif" | "mono" = "sans",
): string {
  const fontConfig = getThemeFont(themeValue);
  const family = role === "sans" ? fontConfig.family : fontConfig[role];
  const monoFonts = [
    "JetBrains Mono",
    "Fira Code",
    "Source Code Pro",
    "Space Mono",
    "Geist Mono",
    "Courier New",
    "Roboto Mono",
    "Ubuntu Mono",
    "Menlo",
  ];
  const serifFonts = [
    "Merriweather",
    "Libre Baskerville",
    "Lora",
    "Playfair Display",
    "Source Serif 4",
    "Georgia",
    "Times New Roman",
    "Signifier",
  ];
  const fallback =
    role === "mono" || monoFonts.includes(family)
      ? "monospace"
      : role === "serif" || serifFonts.includes(family)
        ? "serif"
        : "sans-serif";

  return `${family}, ${fallback}`;
}

function getGoogleFontUrl(
  family: string,
  weights: number[],
  display: ThemeFontConfig["display"],
): string {
  return `https://fonts.googleapis.com/css2?family=${family.replace(/\s/g, "+")}:wght@${weights.join(";")}&display=${display}`;
}

/**
 * Get the active theme's body font family.
 */
export function getFontFamily(themeValue: string): string {
  return getFontStack(themeValue);
}
