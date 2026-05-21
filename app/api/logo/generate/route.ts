import { NextRequest, NextResponse } from "next/server";
import { generateLogoVariations } from "@/lib/logo-ai";
import { auth } from "@/lib/auth";

// Polyfill for Edge runtime
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = {
    randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
  };
}

interface GenerateRequest {
  prompt: string;
  style?: "minimal" | "modern" | "classic" | "playful";
  colors?: string[];
  count?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Get session using better-auth
    const session = await auth.api.getSession({
      headers: new Headers(request.headers),
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { prompt, style = "modern", colors = [], count = 4 } = body;

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Generate logos
    console.log("Generating logos for prompt:", prompt);
    const logos = await generateLogoVariations({ prompt, style, colors }, count);
    console.log("Generated logos:", logos.length);

    return NextResponse.json({
      success: true,
      logos,
      quota: {
        used: 0,
        limit: 5,
        remaining: 5,
        requiresUpgrade: false,
      },
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to generate logos. Please try again.",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
