import { landingConfig } from "@/config/landing"
import { BenefitsSection } from "@/components/sections/landing/benefits-section"
import { CtaSection } from "@/components/sections/landing/cta-section"
import { FaqSection } from "@/components/sections/landing/faq-section"
import { HeroSection } from "@/components/sections/landing/hero-section"
import { HowItWorksSection } from "@/components/sections/landing/how-it-works-section"
import { PricingSection } from "@/components/sections/landing/pricing-section"
import { SocialProofSection } from "@/components/sections/landing/social-proof-section"
import { TestimonialsSection } from "@/components/sections/landing/testimonials-section"

export default function IndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection data={landingConfig.hero} />
      <SocialProofSection data={landingConfig.socialProof} />
      <BenefitsSection data={landingConfig.benefits} />
      <TestimonialsSection data={landingConfig.testimonials} />
      <HowItWorksSection data={landingConfig.howItWorks} />
      <PricingSection data={landingConfig.pricing} />
      <FaqSection data={landingConfig.faq} />
      <CtaSection data={landingConfig.finalCta} />
    </div>
  )
}
