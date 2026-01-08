import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { landingConfig } from "@/config/landing"
import { cn } from "@/lib/utils"

type CtaSectionProps = {
  data: typeof landingConfig.finalCta
}

export function CtaSection({ data }: CtaSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {data.urgency.enabled && (
            <Badge variant={data.urgency.variant} className="mb-4 sm:mb-6">
              {data.urgency.text}
            </Badge>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.subtitle}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6">
            <Link
              href={data.primary.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none h-11 px-8 w-full sm:w-auto",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {data.primary.text}
            </Link>
            <Link
              href={data.secondary.href}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none h-11 px-8 w-full sm:w-auto",
                "border border-input hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {data.secondary.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
