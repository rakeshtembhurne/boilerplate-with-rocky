/**
 * AI Logo Generation Library
 * Generates placeholder SVG logos (demo mode)
 * For production: Configure INFERENCE_SH_API_KEY or use OpenRouter multimodal models
 */

import { env } from "@/env.mjs"

export interface LogoGenerationParams {
  prompt: string;
  style?: "minimal" | "modern" | "classic" | "playful";
  colors?: string[];
}

export interface GeneratedLogo {
  id: string;
  imageUrl: string;
  prompt: string;
  provider: "svg" | "inference" | "openrouter";
  createdAt: Date;
}

function buildLogoPrompt(params: LogoGenerationParams): string {
  const { prompt, style = "modern", colors = [] } = params;
  
  const styleNote = {
    minimal: "Minimalist",
    modern: "Modern",
    classic: "Classic",
    playful: "Playful"
  }[style];

  return `${styleNote} logo for: ${prompt}${colors.length > 0 ? ` (Colors: ${colors.join(", ")})` : ""}`;
}

// Generate a unique SVG logo based on prompt
function generateSvgLogo(prompt: string, style: string): string {
  // Generate consistent colors based on prompt hash
  const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 7) % 360;
  
  const color1 = `hsl(${hue1}, 70%, 45%)`;
  const color2 = `hsl(${hue2}, 60%, 55%)`;
  
  // Different shapes based on style
  const shapes: Record<string, string> = {
    minimal: `
      <circle cx="128" cy="80" r="40" fill="${color1}"/>
      <rect x="68" y="140" width="120" height="16" rx="4" fill="${color2}"/>
    `,
    modern: `
      <polygon points="128,30 188,100 168,100 168,180 88,180 88,100 68,100" fill="${color1}"/>
      <circle cx="128" cy="105" r="25" fill="${color2}"/>
    `,
    classic: `
      <rect x="68" y="50" width="120" height="100" rx="8" fill="${color1}"/>
      <circle cx="128" cy="100" r="35" fill="${color2}"/>
      <path d="M88 155 L128 175 L168 155" stroke="${color1}" stroke-width="8" fill="none" stroke-linecap="round"/>
    `,
    playful: `
      <ellipse cx="128" cy="100" rx="70" ry="60" fill="${color1}"/>
      <circle cx="100" cy="85" r="12" fill="white"/>
      <circle cx="156" cy="85" r="12" fill="white"/>
      <path d="M100 125 Q128 145 156 125" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
    `
  };
  
  const shape = shapes[style] || shapes.modern;
  const brandName = prompt.split(' ').slice(0, 2).join(' ').substring(0, 15) || 'BRAND';
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" fill="white"/>
      ${shape}
      <text x="128" y="220" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#333" text-anchor="middle">${brandName}</text>
    </svg>
  `)}`;
}

export async function generateLogoImage(params: LogoGenerationParams): Promise<GeneratedLogo> {
  const { style = "modern" } = params;
  
  // Try inference.sh first if configured
  if (env.INFERENCE_SH_API_KEY) {
    try {
      const imageUrl = await generateWithInference(buildLogoPrompt(params));
      return {
        id: crypto.randomUUID(),
        imageUrl,
        prompt: buildLogoPrompt(params),
        provider: "inference",
        createdAt: new Date(),
      };
    } catch (e) {
      console.warn("Inference.sh failed, using SVG fallback:", e);
    }
  }
  
  // Fallback to SVG placeholder (demo mode)
  console.log("Using SVG logo generation (demo mode)");
  return {
    id: crypto.randomUUID(),
    imageUrl: generateSvgLogo(buildLogoPrompt(params), style),
    prompt: buildLogoPrompt(params),
    provider: "svg",
    createdAt: new Date(),
  };
}

async function generateWithInference(prompt: string): Promise<string> {
  const apiKey = env.INFERENCE_SH_API_KEY;
  
  if (!apiKey) {
    throw new Error("INFERENCE_SH_API_KEY not configured");
  }
  
  const response = await fetch(env.INFERENCE_SH_URL || "https://queue.inference-dog.workers.dev/api/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${prompt}, logo, minimal, clean, vector style, transparent background`,
      model: "black-forest-labs/flux-schnell",
      num_inference_steps: 4,
      guidance: 3.5,
      num_images: 1,
      size: "1024x1024",
      output_format: "jpeg",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Inference.sh API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.task_id) {
    return await pollInferenceResult(data.task_id);
  }
  
  return data.images?.[0]?.url || `data:image/jpeg;base64,${data.images?.[0]?.base64}`;
}

async function pollInferenceResult(taskId: string, maxAttempts = 60): Promise<string> {
  const baseUrl = env.INFERENCE_SH_URL?.replace("/api/generate", "") || "https://queue.inference-dog.workers.dev";
  const apiKey = env.INFERENCE_SH_API_KEY;
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${baseUrl}/api/status/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }

    const data = await response.json();
    
    if (data.status === "completed") {
      return data.result?.images?.[0]?.url || `data:image/jpeg;base64,${data.result?.images?.[0]?.base64}`;
    }
    
    if (data.status === "failed") {
      throw new Error(`Inference task failed: ${data.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error("Inference task timed out");
}

// Batch generation
export async function generateLogoVariations(
  params: LogoGenerationParams,
  count: number = 4
): Promise<GeneratedLogo[]> {
  const results = await Promise.allSettled(
    Array.from({ length: count }, () => generateLogoImage(params))
  );

  const successful = results
    .filter((result): result is PromiseFulfilledResult<GeneratedLogo> => result.status === "fulfilled")
    .map(result => result.value);
  
  console.log(`Generated ${successful.length}/${count} logos`);
  return successful;
}
