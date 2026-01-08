import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Icons } from "@/components/shared/icons"
import { landingConfig } from "@/config/landing"

type TestimonialsSectionProps = {
  data: typeof landingConfig.testimonials
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  if (!data.enabled) return null

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{data.section.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">{data.section.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="p-6 sm:p-8">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icons.star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow sm:p-8 sm:pt-0">
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 sm:p-8 sm:pt-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl sm:h-14 sm:w-14 sm:text-2xl">
                    {testimonial.author.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.author.name}</div>
                    <div className="text-xs text-muted-foreground sm:text-sm">{testimonial.author.role}</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
