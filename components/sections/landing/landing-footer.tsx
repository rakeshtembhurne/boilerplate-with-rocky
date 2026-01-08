import Link from "next/link"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { landingConfig } from "@/config/landing"

type LandingFooterProps = {
  data: typeof landingConfig.footer
}

export function LandingFooter({ data }: LandingFooterProps) {
  if (!data.enabled) return null

  return (
    <footer className="border-t bg-muted/20 py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Newsletter Section */}
        {data.newsletter.enabled && (
          <div className="grid gap-6 rounded-lg bg-background p-6 shadow-lg md:grid-cols-2 md:gap-12 md:p-10 lg:p-12">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{data.newsletter.title}</h2>
              <p className="text-base text-muted-foreground sm:text-lg">{data.newsletter.description}</p>
            </div>
            <form className="flex w-full max-w-md items-start space-x-2">
              <Input
                type="email"
                placeholder={data.newsletter.placeholder}
                className="h-11 flex-grow text-base sm:h-12"
              />
              <Button type="submit" size="lg" className="h-11 sm:h-12">
                {data.newsletter.buttonText}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
          {data.links.map((column, index) => (
            <div key={index}>
              <h3 className="mb-4 font-semibold text-base sm:mb-6 sm:text-lg">{column.title}</h3>
              <ul className="space-y-3 sm:space-y-4">
                {column.items.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col-reverse items-center justify-between gap-6 sm:mt-16 sm:pt-10 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">{data.copyright.text}</p>
          <div className="flex items-center gap-4 sm:gap-6">
            {data.social.items.map((item, index) => (
              <Link key={index} href={item.href} className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">{item.label}</span>
                <span className="text-xl sm:text-2xl">{item.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
