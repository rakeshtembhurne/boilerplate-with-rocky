"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Loader2, 
  Check, 
  Zap,
  Crown
} from "lucide-react";

type Style = "minimal" | "modern" | "classic" | "playful";
type Logo = {
  id: string;
  imageUrl: string;
  prompt: string;
};

const STYLE_OPTIONS = [
  { value: "modern", label: "Modern", description: "Sleek, contemporary, tech-forward" },
  { value: "minimal", label: "Minimal", description: "Clean lines, simple shapes" },
  { value: "classic", label: "Classic", description: "Timeless, traditional feel" },
  { value: "playful", label: "Playful", description: "Fun, friendly, vibrant" },
];

const COLOR_PRESETS = [
  { name: "Professional Blue", colors: ["#1E40AF", "#3B82F6", "#93C5FD"] },
  { name: "Earth Tones", colors: ["#78350F", "#D97706", "#FDE68A"] },
  { name: "Modern Purple", colors: ["#581C87", "#7C3AED", "#C4B5FD"] },
  { name: "Fresh Green", colors: ["#14532D", "#22C55E", "#86EFAC"] },
  { name: "Bold Red", colors: ["#7F1D1D", "#EF4444", "#FCA5A5"] },
  { name: "Monochrome", colors: ["#171717", "#52525B", "#A1A1AA"] },
];

export default function CreateLogoPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<Style>("modern");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<{
    used: number;
    limit: number;
    remaining: number;
    requiresUpgrade: boolean;
  } | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your logo idea");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/logo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          colors: selectedColors,
          count: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setQuota(data.quota);
          setShowUpgradeDialog(true);
          return;
        }
        throw new Error(data.error || "Failed to generate logos");
      }

      setLogos(data.logos);
      setQuota(data.quota);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (logo: Logo) => {
    try {
      const response = await fetch(logo.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logo-${logo.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download logo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">BrandSome</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="/create" className="text-sm font-medium text-violet-600">Create</a>
            <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</a>
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            {quota && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-muted-foreground">{quota.remaining} left</span>
              </div>
            )}
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              My Logos
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Create Your Perfect Logo
          </h1>
          <p className="text-lg text-muted-foreground">
            Describe your brand and let AI generate professional logos in seconds.
            {quota?.requiresUpgrade && (
              <span className="text-violet-600 font-medium"> Upgrade for unlimited generations.</span>
            )}
          </p>
        </div>

        {/* Generator Card */}
        <Card className="max-w-3xl mx-auto mb-12">
          <CardHeader>
            <CardTitle>Design Your Logo</CardTitle>
            <CardDescription>
              Describe your brand, choose a style, and let AI do the rest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What does your brand do?</label>
              <Input
                placeholder="e.g., A eco-friendly coffee shop with a focus on sustainability"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-base py-6"
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about your industry, values, and any visual elements you prefer
              </p>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Palette (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedColors(
                      selectedColors.length === 3 && 
                      preset.colors.every(c => selectedColors.includes(c))
                        ? []
                        : preset.colors
                    )}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      preset.colors.every(c => selectedColors.includes(c))
                        ? "border-violet-500 bg-violet-50"
                        : "border-border hover:border-violet-300"
                    }`}
                  >
                    <div className="flex -space-x-1">
                      {preset.colors.map((color) => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border border-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs">{preset.name}</span>
                    {preset.colors.every(c => selectedColors.includes(c)) && (
                      <Check className="w-3 h-3 text-violet-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate 4 Logo Variations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Logos */}
        {logos.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Generated Logos</h2>
              <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logos.map((logo) => (
                <Card key={logo.id} className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center">
                    {logo.imageUrl.startsWith("data:") ? (
                      // Base64 image
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo.imageUrl}
                        alt="Generated logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      // URL image
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo.imageUrl}
                        alt="Generated logo"
                        className="max-w-full max-h-full object-contain"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {logo.prompt}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDownload(logo)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedLogo(logo)}
                      >
                        Customize
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        {logos.length === 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Describe Your Brand</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us what your business does, your values, and your preferred style
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Generates Options</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI creates multiple professional logo variations based on your description
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Download & Use</h3>
                <p className="text-sm text-muted-foreground">
                  Get high-quality PNG and SVG files ready for any use case
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription>
              You've reached your free generation limit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-violet-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Pro Plan</span>
                <span className="text-2xl font-bold">$20<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  50 logo generations per month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  High-resolution downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Commercial use rights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => router.push("/pricing")}
              >
                View Plans
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeDialog(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
