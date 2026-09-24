/**
 * Generates `lib/theme-presets.generated.ts` from `styles/themes.css`.
 *
 * `styles/themes.css` is the single source of truth for selectable themes, so
 * the typed registry can never drift from the actual CSS.
 *
 *   bun run themes:generate   # write the registry
 *   bun run themes:check      # fail if the registry is stale (CI)
 */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const CSS_PATH = "styles/themes.css";
const OUT_PATH = "lib/theme-presets.generated.ts";
const TOKENS = ["primary", "accent", "chart-1", "chart-2"];

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const css = await readFile(CSS_PATH, "utf8");
const matches = [...css.matchAll(/\[data-theme-preset="([^"]+)"\]/g)];

const seen = new Set<string>();
const presets: { name: string; value: string; colors: string[] }[] = [];

for (let i = 0; i < matches.length; i++) {
  const value = matches[i][1];
  if (seen.has(value)) continue;
  seen.add(value);

  const start = matches[i].index ?? 0;
  const end =
    i + 1 < matches.length ? (matches[i + 1].index ?? css.length) : css.length;
  const block = css.slice(start, end);

  const colors = TOKENS.map((token) =>
    block.match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1]?.trim(),
  ).filter((color): color is string => Boolean(color));

  presets.push({
    name: titleCase(value),
    value,
    colors: colors.length ? colors : ["oklch(0.5 0 0)"],
  });
}

presets.sort((a, b) => a.name.localeCompare(b.name));

const output = `// AUTO-GENERATED from styles/themes.css by scripts/generate-themes.ts
// Do not edit by hand. Run: bun run themes:generate

export interface ThemePreset {
  name: string;
  value: string;
  colors: string[];
}

export const THEME_PRESETS: ThemePreset[] = ${JSON.stringify(presets, null, 2)};
`;

const isCheck = process.argv.includes("--check");
const existing = existsSync(OUT_PATH) ? await readFile(OUT_PATH, "utf8") : "";

if (isCheck) {
  if (existing.trim() !== output.trim()) {
    console.error(
      "lib/theme-presets.generated.ts is out of date. Run: bun run themes:generate",
    );
    process.exit(1);
  }
  console.log("Theme presets are up to date.");
  process.exit(0);
}

await writeFile(OUT_PATH, output);
console.log(`Generated ${presets.length} theme presets -> ${OUT_PATH}`);
