import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { landingConfig } from "@/config/landing"
import { cn } from "@/lib/utils"

type HeroSectionProps = {
  data: typeof landingConfig.hero
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          {data.badge && (
            <Badge variant={data.badge.variant} className="mb-6 px-4 py-1.5 text-sm">
              {data.badge.text}
            </Badge>
          )}

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {data.headline.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {data.headline.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href={data.cta.primary.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none h-11 px-8 w-full sm:w-auto",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {data.cta.primary.text}
            </Link>
            <Link
              href={data.cta.secondary.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none h-11 px-8 w-full sm:w-auto",
                "border border-input hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {data.cta.secondary.text}
            </Link>
          </div>

          {/* Trust Badge */}
          {data.trust.enabled && (
            <p className="mt-12 text-sm text-muted-foreground">{data.trust.text}</p>
          )}

          {/* Code Visual */}
          {data.visual.type === "code" && (
            <div className="mt-12 rounded-xl border bg-muted/50 p-6 text-left shadow-lg sm:mt-16">
              <pre className="overflow-x-auto text-sm">
                <code>{data.visual.content}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
