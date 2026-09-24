import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { ogImageSchema } from "@/lib/validations/og";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams));
    const heading =
      values.heading.length > 80
        ? `${values.heading.slice(0, 100)}…`
        : values.heading;

    const { mode } = values;
    const paint = mode === "dark" ? "#ffffff" : "#000000";
    const background = mode === "dark" ? "#0a0a0a" : "#ffffff";
    const fontSize = heading.length > 80 ? 60 : 80;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: 48,
            background,
            color: paint,
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            {siteConfig.name}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              {values.type}
            </div>
            <div style={{ display: "flex", fontSize, fontWeight: 800, lineHeight: 1.15 }}>
              {heading}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 20 }}>{siteConfig.url}</div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
