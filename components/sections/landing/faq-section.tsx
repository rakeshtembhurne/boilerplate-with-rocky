import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { landingConfig } from "@/config/landing"

type FaqSectionProps = {
  data: typeof landingConfig.faq
}

export function FaqSection({ data }: FaqSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.section.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.section.subtitle}</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {data.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-2">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-4 sm:text-xl sm:py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4 sm:pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
