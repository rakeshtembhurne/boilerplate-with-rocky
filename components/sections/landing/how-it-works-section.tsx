import { Icons } from "@/components/shared/icons"
import { landingConfig } from "@/config/landing"

type HowItWorksSectionProps = {
  data: typeof landingConfig.howItWorks
}

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.section.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.section.subtitle}</p>
        </div>

        <div className="grid gap-8 md:gap-12 md:grid-cols-3">
          {data.steps.map((step, index) => (
            <div key={index} className="space-y-4 text-center sm:space-y-6">
              <div className="text-6xl font-bold text-muted-foreground/10 sm:text-7xl md:text-8xl">{step.number}</div>
              <h3 className="text-xl font-semibold sm:text-2xl">{step.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">{step.description}</p>
              <div className="relative rounded-lg bg-slate-900 p-4 sm:p-6">
                <Icons.copy className="absolute right-3 top-3 h-4 w-4 text-slate-500 sm:right-4 sm:top-4 sm:h-5 sm:w-5" />
                <pre className="text-left text-xs text-slate-100 sm:text-sm">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
