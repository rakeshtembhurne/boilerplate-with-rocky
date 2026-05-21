import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    description: "Perfect for trying out BrandSome",
    price: 0,
    features: [
      "5 logo generations per month",
      "Basic logo styles",
      "PNG downloads (1024x1024)",
      "Community support",
    ],
    cta: "Get Started",
    href: "/auth/signup",
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
    href: "/auth/signup?plan=pro",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">BrandSome</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="/create" className="text-sm text-muted-foreground hover:text-foreground">Create Logo</a>
            <a href="/pricing" className="text-sm font-medium text-violet-600">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative ${
                    plan.highlight 
                      ? "border-violet-500 shadow-lg shadow-violet-100" 
                      : ""
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name === "Pro" && <Crown className="w-5 h-5 text-amber-500" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
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
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-8">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create Your Logo?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of businesses who trust BrandSome for their brand identity.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">BrandSome</span>
              </div>
              
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/contact">Contact</a>
              </div>
              
              <p className="text-sm text-muted-foreground">
                © 2024 BrandSome. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
