export const DEFAULT_THEME = {
  preset: "default",
  radius: "default",
  scale: "none",
  contentLayout: "full"
} as const;

export type ThemeType = typeof DEFAULT_THEME;

export const THEMES = [
  {
    name: "Amber Minimal",
    value: "amber-minimal",
    colors: ["oklch(0.767 0.177 68.47)"]
  },
  {
    name: "Amethyst Haze",
    value: "amethyst-haze",
    colors: ["oklch(0.646 0.191 165.61)"]
  },
  {
    name: "Bold Tech",
    value: "bold-tech",
    colors: ["oklch(0.478 0.042 264.38)"]
  },
  {
    name: "Candyland",
    value: "candyland",
    colors: ["oklch(0.823 0.189 85.48)"]
  },
  {
    name: "Catppuccin",
    value: "catppuccin",
    colors: ["oklch(0.646 0.222 142.50)"]
  },
  {
    name: "Claude",
    value: "claude",
    colors: ["oklch(0.553 0.248 272.14)"]
  },
  {
    name: "Clean Slate",
    value: "clean-slate",
    colors: ["oklch(1 0 0)"]
  },
  {
    name: "Claymorphism",
    value: "claymorphism",
    colors: ["oklch(0.683 0.248 12.23)"]
  },
  {
    name: "Cosmic Night",
    value: "cosmic-night",
    colors: ["oklch(0.479 0.017 268.84)"]
  },
  {
    name: "Darkmatter",
    value: "darkmatter",
    colors: ["oklch(0.094 0 0)"]
  },
  {
    name: "Doom 64",
    value: "doom-64",
    colors: ["oklch(0.639 0.242 27.33)"]
  },
  {
    name: "Elegant Luxury",
    value: "elegant-luxury",
    colors: ["oklch(0.635 0.189 188.41)"]
  },
  {
    name: "Kodama Grove",
    value: "kodama-grove",
    colors: ["oklch(0.646 0.222 142.50)"]
  },
  {
    name: "Midnight Bloom",
    value: "midnight-bloom",
    colors: ["oklch(0.464 0.017 264.38)"]
  },
  {
    name: "Modern Minimal",
    value: "modern-minimal",
    colors: ["oklch(0.479 0.042 264.38)"]
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
    colors: ["oklch(0.767 0.177 68.47)"]
  },
  {
    name: "Mono",
    value: "mono",
    colors: ["oklch(0.479 0 0)"]
  },
  {
    name: "Nature",
    value: "nature",
    colors: ["oklch(0.646 0.222 142.50)"]
  },
  {
    name: "Neo Brutalism",
    value: "neo-brutalism",
    colors: ["oklch(0.639 0.242 27.33)"]
  },
  {
    name: "Northern Lights",
    value: "northern-lights",
    colors: ["oklch(0.635 0.242 254.14)"]
  },
  {
    name: "Notebook",
    value: "notebook",
    colors: ["oklch(0.922 0.012 60.19)"]
  },
  {
    name: "Ocean Breeze",
    value: "ocean-breeze",
    colors: ["oklch(0.635 0.173 177.07)"]
  },
  {
    name: "Pastel Dreams",
    value: "pastel-dreams",
    colors: ["oklch(0.713 0.172 236.62)"]
  },
  {
    name: "Perpetuity",
    value: "perpetuity",
    colors: ["oklch(0.464 0.017 264.38)"]
  },
  {
    name: "Quantum Rose",
    value: "quantum-rose",
    colors: ["oklch(0.637 0.248 316.07)"]
  },
  {
    name: "Retro Arcade",
    value: "retro-arcade",
    colors: ["oklch(0.639 0.242 27.33)"]
  },
  {
    name: "Soft Pop",
    value: "soft-pop",
    colors: ["oklch(0.713 0.242 343.55)"]
  },
  {
    name: "Solar Dusk",
    value: "solar-dusk",
    colors: ["oklch(0.646 0.222 38.99)"]
  },
  {
    name: "Starry Night",
    value: "starry-night",
    colors: ["oklch(0.094 0 0)"]
  },
  {
    name: "Sunset Horizon",
    value: "sunset-horizon",
    colors: ["oklch(0.646 0.222 38.99)"]
  },
  {
    name: "Supabase",
    value: "supabase",
    colors: ["oklch(0.646 0.222 142.50)"]
  },
  {
    name: "T3 Chat",
    value: "t3-chat",
    colors: ["oklch(0.464 0.017 264.38)"]
  },
  {
    name: "Tangerine",
    value: "tangerine",
    colors: ["oklch(0.646 0.222 38.99)"]
  },
  {
    name: "Twitter",
    value: "twitter",
    colors: ["oklch(0.635 0.242 254.14)"]
  },
  {
    name: "Vintage Paper",
    value: "vintage-paper",
    colors: ["oklch(0.922 0.012 60.19)"]
  },
  {
    name: "Violet Bloom",
    value: "violet-bloom",
    colors: ["oklch(0.583 0.262 301.72)"]
  },
   {
     name: "Bubblegum",
     value: "bubblegum",
     colors: ["#d04f99"]
   },
   {
     name: "Graphite",
     value: "graphite",
     colors: ["#606060"]
   },
   {
     name: "Caffeine",
     value: "caffeine",
     colors: ["#644a40"]
   },
   {
     name: "Cyberpunk",
     value: "cyberpunk",
     colors: ["#ff00c8"]
   },
   {
     name: "Vercel",
     value: "vercel",
     colors: ["oklch(1 0 0)"]
   }
 ];
