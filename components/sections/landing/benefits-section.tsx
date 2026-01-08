import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { landingConfig } from "@/config/landing"

type BenefitsSectionProps = {
  data: typeof landingConfig.benefits
}

export function BenefitsSection({ data }: BenefitsSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-background py-16 sm:py-20" id="features">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.section.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.section.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {data.features.map((feature, index) => (
            <Card key={index} className="relative border-none shadow-lg hover:shadow-xl transition-shadow">
              {feature.badge && (
                <Badge className="absolute -right-3 -top-3 z-10" variant="default">
                  {feature.badge}
                </Badge>
              )}
              <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-4">
                <div className="text-4xl mb-3 sm:text-5xl sm:mb-4">{feature.icon}</div>
                <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
                <CardDescription className="text-base leading-relaxed sm:text-lg">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
