import { readFile } from "node:fs/promises";
import { describe, expect, test } from "bun:test";

const commandSource = await readFile(
  new URL("../components/ui/command.tsx", import.meta.url),
  "utf8",
);
const modalSource = await readFile(
  new URL("../components/ui/modal.tsx", import.meta.url),
  "utf8",
);
const chartSource = await readFile(
  new URL("../components/ui/chart.tsx", import.meta.url),
  "utf8",
);

describe("shared dashboard UI accessibility and sizing", () => {
  test("gives command dialogs an accessible description", () => {
    expect(commandSource).toContain("DialogDescription");
  });

  test("gives shared modals an accessible description", () => {
    expect(modalSource).toContain("DialogDescription");
  });

  test("gives Recharts a positive initial dimension and flexible width", () => {
    expect(chartSource).toContain("initialDimension");
    expect(chartSource).toContain("min-w-0");
  });
});
