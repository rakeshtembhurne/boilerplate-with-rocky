import { landingConfig } from "@/config/landing"

type SocialProofSectionProps = {
  data: typeof landingConfig.socialProof
}

export function SocialProofSection({ data }: SocialProofSectionProps) {
  if (!data.enabled) return null

  return (
    <>
      {/* ============================================
          SOCIAL PROOF - LOGOS
      ============================================ */}
      {data.logos && (
        <section className="bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h3 className="text-center text-lg font-medium text-muted-foreground sm:text-xl">
              {data.logos.subtitle}
            </h3>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:mt-10 sm:gap-12">
              {data.logos.companies.map((company, index) => (
                <div key={index} className="flex items-center gap-2 text-xl text-muted-foreground">
                  <span className="text-2xl">{company.logo}</span>
                  <span className="font-semibold">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          SOCIAL PROOF - STATS
      ============================================ */}
      {data.stats && (
        <section className="bg-background py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold tracking-tight sm:text-5xl">{stat.value}</div>
                  <div className="mt-3 text-sm text-muted-foreground sm:mt-4">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
