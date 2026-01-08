import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/shared/icons"
import { landingConfig } from "@/config/landing"
import { cn } from "@/lib/utils"

type PricingSectionProps = {
  data: typeof landingConfig.pricing
}

export function PricingSection({ data }: PricingSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-muted/30 py-16 sm:py-20" id="pricing">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.section.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.section.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col border-none ${
                plan.popular ? "shadow-2xl ring-2 ring-primary scale-105" : "shadow-lg hover:shadow-xl transition-shadow"
              }`}
            >
              {plan.popular && plan.badge && (
                <Badge className="absolute -right-3 -top-3 z-10" variant="default">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl">{plan.name}</CardTitle>
                <CardDescription className="text-base pt-2 sm:text-lg">{plan.description}</CardDescription>
                <div className="pt-4 sm:pt-6">
                  <span className="text-4xl font-bold sm:text-5xl md:text-6xl">${plan.price.monthly}</span>
                  <span className="text-muted-foreground text-lg sm:text-xl">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow sm:p-8 sm:pt-0">
                <ul className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icons.check className="h-5 w-5 shrink-0 text-primary mt-0.5 sm:h-6 sm:w-6" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 pt-0 sm:p-8 sm:pt-0">
                <Link
                  href={plan.cta.href}
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none h-11",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {plan.cta.text}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
