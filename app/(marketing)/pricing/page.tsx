import Link from "next/link";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PLANS = [
  {
    name: "Free",
    description: "Perfect for trying out Acme",
    price: 0,
    features: [
      "5 logo generations per month",
      "Basic logo styles",
      "PNG downloads (1024x1024)",
      "Community support",
    ],
    cta: "Get Started",
    href: "/auth/sign-up",
    highlight: false,
  },
  {
    name: "Pro",
    description: "For professionals and growing businesses",
    price: 20,
    features: [
      "50 logo generations per month",
      "All logo styles",
      "High-resolution downloads (2048x2048)",
      "SVG vector files",
      "Commercial use rights",
      "Color palette export",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/auth/sign-up?plan=pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "For teams and agencies",
    price: 99,
    features: [
      "Unlimited logo generations",
      "All Pro features",
      "Team collaboration",
      "Custom brand guidelines",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "What counts as a logo generation?",
    a: "Each time you generate a set of 4 logo variations, it counts as 1 generation. Unused generations reset monthly.",
  },
  {
    q: "Can I use the logos commercially?",
    a: "Pro and Enterprise plans include full commercial rights. You can use your generated logos for any business purpose.",
  },
  {
    q: "What file formats do I get?",
    a: "All plans include PNG files. Pro and Enterprise plans also include SVG vector files.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period.",
  },
  {
    q: "Do unused generations roll over?",
    a: "No, unused generations reset at the start of each billing cycle. We recommend using them monthly!",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="bg-muted/30 border-b px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="bg-primary text-primary-foreground shadow-primary/20 mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl">
            <Sparkles className="size-7" aria-hidden="true" />
          </div>
          <p className="text-primary mb-4 text-sm font-medium">
            Simple, transparent pricing
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Start free. Scale when you are ready.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8 md:text-xl">
            Choose the plan that fits your workflow. Upgrade when you need more,
            with no hidden fees and cancellation anytime.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get started free
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlight
                  ? "border-primary shadow-primary/10 shadow-lg"
                  : ""
              }`}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {plan.name === "Pro" ? (
                    <Crown className="text-primary size-5" aria-hidden="true" />
                  ) : null}
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 ? (
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  ) : null}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        className="text-primary mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-y px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground mt-3">
              Everything you need to know before you start.
            </p>
          </div>
          <div className="space-y-8">
            {FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="text-lg font-semibold">{item.q}</h3>
                <p className="text-muted-foreground mt-2 leading-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to create your next logo?
          </h2>
          <p className="text-muted-foreground mt-4">
            Join businesses using {siteConfig.name} to build a clearer brand
            identity.
          </p>
          <Link href="/auth/sign-up" className="mt-8 inline-block">
            <Button size="lg">
              <Zap className="mr-2 size-5" aria-hidden="true" />
              Get started free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
