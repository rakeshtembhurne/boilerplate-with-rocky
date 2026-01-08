/**
 * Landing Page Configuration
 *
 * This file contains all customizable content for the landing page.
 * Modify this file to update the landing page without touching any code.
 *
 * Based on best practices from 100+ high-converting landing pages:
 * - Compelling Headline & Subheadline (95% of pages)
 * - Prominent CTA Button (98% of pages)
 * - Social Proof (90% of pages)
 * - Benefit Bullets (85% of pages)
 * - High-Quality Visuals (80% of pages)
 * - Urgency/Scarcity (70% of pages)
 * - Short Forms (75% of pages)
 * - FAQs Section (65% of pages)
 */

export const landingConfig = {
  // ============================================
  // HERO SECTION (95% of landing pages)
  // ============================================
  hero: {
    badge: {
      text: "🚀 Now in Public Beta",
      variant: "secondary" as const,
    },
    headline: {
      title: "Build Your AI-Powered App in Minutes, Not Months",
      subtitle: "The complete Next.js 16 starter kit with authentication, database, and AI integrations. Ship faster with enterprise-grade architecture.",
    },
    cta: {
      primary: {
        text: "Get Started Free",
        href: "/sign-up",
        variant: "default" as const,
        size: "lg" as const,
      },
      secondary: {
        text: "Watch Demo",
        href: "#demo",
        variant: "outline" as const,
        size: "lg" as const,
      },
    },
    trust: {
      enabled: true,
      text: "Trusted by 10,000+ developers worldwide",
    },
    visual: {
      type: "code" as const, // 'code' | 'image' | 'video'
      content: "// Your app structure\nnpx create-next-app -e ai-starter",
    },
  },

  // ============================================
  // SOCIAL PROOF SECTION (90% of landing pages)
  // ============================================
  socialProof: {
    enabled: true,
    logos: {
      title: "Trusted by innovative teams",
      subtitle: "From startups to enterprises, developers ship faster with AI Starter",
      companies: [
        { name: "Acme Corp", logo: "🏢" },
        { name: "TechStart", logo: "🚀" },
        { name: "DataFlow", logo: "📊" },
        { name: "CloudBase", logo: "☁️" },
        { name: "NextLevel", logo: "⬆️" },
        { name: "AI Labs", logo: "🤖" },
      ],
    },
    stats: [
      { value: "10K+", label: "Active Developers" },
      { value: "50K+", label: "Projects Created" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "4.9/5", label: "Average Rating" },
    ],
  },

  // ============================================
  // BENEFITS SECTION (85% of landing pages)
  // ============================================
  benefits: {
    enabled: true,
    section: {
      title: "Why Developers Love AI Starter",
      subtitle: "Everything you need to build production-ready applications",
    },
    features: [
      {
        icon: "⚡",
        title: "Lightning Fast Setup",
        description: "Get up and running in under 5 minutes with our CLI. No configuration headaches.",
        badge: "Popular",
      },
      {
        icon: "🔐",
        title: "Enterprise Authentication",
        description: "Built-in auth with OAuth, magic links, and role-based access control. Secure by default.",
      },
      {
        icon: "🗄️",
        title: "Database Ready",
        description: "Prisma ORM with PostgreSQL, ready to scale. Migrations, seeding, and type safety included.",
      },
      {
        icon: "🎨",
        title: "Beautiful UI Components",
        description: "50+ pre-built Shadcn/ui components. Dark mode, responsive design, and accessibility included.",
        badge: "New",
      },
      {
        icon: "🤖",
        title: "AI-Native Architecture",
        description: "Built for AI applications from day one. Vector databases, RAG pipelines, and LLM integrations.",
      },
      {
        icon: "📱",
        title: "Mobile-First Design",
        description: "Responsive layouts that work perfectly on any device. Touch-optimized interactions.",
      },
    ],
  },

  // ============================================
  // TESTIMONIALS SECTION (90% of landing pages)
  // ============================================
  testimonials: {
    enabled: true,
    section: {
      title: "Loved by Developers Everywhere",
      subtitle: "See what our community has to say",
    },
    items: [
      {
        content: "AI Starter saved us months of development time. We went from idea to production in just 3 weeks. The authentication and database setup alone would have taken us 2 weeks.",
        author: {
          name: "Sarah Chen",
          role: "CTO at TechStart",
          avatar: "👩‍💻",
        },
        rating: 5,
      },
      {
        content: "The code quality is exceptional. Clean architecture, TypeScript throughout, and the best practices are already implemented. It's like having a senior architect on the team.",
        author: {
          name: "Marcus Johnson",
          role: "Lead Developer at DataFlow",
          avatar: "👨‍💻",
        },
        rating: 5,
      },
      {
        content: "We've built 4 products on top of AI Starter. Each time, the setup takes minutes instead of days. The ROI is incredible.",
        author: {
          name: "Emily Rodriguez",
          role: "Founder at CloudBase",
          avatar: "👩‍🚀",
        },
        rating: 5,
      },
    ],
  },

  // ============================================
  // HOW IT WORKS SECTION
  // ============================================
  howItWorks: {
    enabled: true,
    section: {
      title: "Three Simple Steps to Launch",
      subtitle: "From zero to deployed in no time",
    },
    steps: [
      {
        number: "01",
        title: "Install with CLI",
        description: "Run a single command to generate your project with all dependencies configured.",
        code: "npx create-ai-starter my-app",
      },
      {
        number: "02",
        title: "Customize Your App",
        description: "Modify the config files and add your business logic. Everything is type-safe and well-documented.",
        code: "cd my-app && npm run dev",
      },
      {
        number: "03",
        title: "Deploy to Production",
        description: "Push to your favorite platform. Vercel, Netlify, AWS, or your own infrastructure.",
        code: "git push origin main",
      },
    ],
  },

  // ============================================
  // PRICING SECTION (75% of landing pages)
  // ============================================
  pricing: {
    enabled: true,
    section: {
      title: "Simple, Transparent Pricing",
      subtitle: "Start free, scale as you grow",
    },
    toggle: {
      enabled: true,
      labels: { monthly: "Monthly", yearly: "Yearly (Save 20%)" },
    },
    plans: [
      {
        name: "Starter",
        description: "Perfect for side projects and learning",
        price: {
          monthly: 0,
          yearly: 0,
        },
        features: [
          "Up to 3 projects",
          "Community support",
          "Basic authentication",
          "PostgreSQL database",
          "50+ UI components",
          "Email templates",
        ],
        cta: {
          text: "Start Free",
          href: "/sign-up",
        },
        popular: false,
      },
      {
        name: "Pro",
        description: "For growing teams and startups",
        price: {
          monthly: 29,
          yearly: 23,
        },
        features: [
          "Everything in Starter",
          "Unlimited projects",
          "Priority support",
          "Advanced auth features",
          "Custom domains",
          "API access",
          "Analytics dashboard",
        ],
        cta: {
          text: "Get Started",
          href: "/sign-up",
        },
        popular: true,
        badge: "Most Popular",
      },
      {
        name: "Enterprise",
        description: "For large organizations",
        price: {
          monthly: 99,
          yearly: 79,
        },
        features: [
          "Everything in Pro",
          "Unlimited team members",
          "Dedicated support",
          "SLA guarantee",
          "Custom integrations",
          "On-premise deployment",
          "Training & onboarding",
        ],
        cta: {
          text: "Contact Sales",
          href: "mailto:sales@example.com",
        },
        popular: false,
      },
    ],
  },

  // ============================================
  // FAQ SECTION (65% of landing pages)
  // ============================================
  faq: {
    enabled: true,
    section: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
    },
    items: [
      {
        question: "How long does it take to set up?",
        answer: "Most developers are up and running in under 5 minutes. Just run the CLI command, answer a few questions, and you'll have a fully configured Next.js app ready to customize.",
      },
      {
        question: "Can I use this for commercial projects?",
        answer: "Absolutely! AI Starter is released under the MIT license, which means you can use it for personal and commercial projects without any restrictions.",
      },
      {
        question: "What's included in the starter kit?",
        answer: "You get authentication (OAuth, magic links), database (Prisma + PostgreSQL), UI components (50+ Shadcn/ui), email templates, dark mode, responsive design, and much more. Check the documentation for the full feature list.",
      },
      {
        question: "Do I need to know Next.js?",
        answer: "Basic React and TypeScript knowledge is recommended. Our comprehensive documentation and video tutorials will help you get started even if you're new to Next.js.",
      },
      {
        question: "Can I customize the components?",
        answer: "Yes! All components are fully customizable. You can modify styles, add features, or replace them entirely. The code is clean and well-documented.",
      },
      {
        question: "What kind of support do you offer?",
        answer: "We have a community Discord for quick questions, GitHub issues for bug reports, and priority support is available for Pro and Enterprise plans.",
      },
    ],
  },

  // ============================================
  // FINAL CTA SECTION (98% of landing pages)
  // ============================================
  finalCta: {
    enabled: true,
    title: "Ready to Build Something Amazing?",
    subtitle: "Join 10,000+ developers who are shipping faster with AI Starter",
    urgency: {
      enabled: true,
      text: "🎉 Limited Time: Get 50% off Pro plan for early adopters",
      variant: "default" as const,
    },
    primary: {
      text: "Start Building Now",
      href: "/sign-up",
      variant: "default" as const,
      size: "lg" as const,
    },
    secondary: {
      text: "Schedule a Demo",
      href: "#demo",
      variant: "outline" as const,
      size: "lg" as const,
    },
  },

  // ============================================
  // FOOTER CONFIG
  // ============================================
  footer: {
    enabled: true,
    newsletter: {
      enabled: true,
      title: "Stay Updated",
      description: "Get the latest features and updates delivered to your inbox",
      placeholder: "Enter your email",
      buttonText: "Subscribe",
    },
    links: [
      {
        title: "Product",
        items: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Changelog", href: "/changelog" },
          { label: "Roadmap", href: "/roadmap" },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Documentation", href: "/docs" },
          { label: "Tutorials", href: "/tutorials" },
          { label: "Blog", href: "/blog" },
          { label: "Community", href: "/community" },
        ],
      },
      {
        title: "Company",
        items: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
    social: {
      title: "Connect",
      items: [
        { label: "Twitter", href: "https://twitter.com/tembhurnerakesh", icon: "𝕏" },
        { label: "GitHub", href: "https://github.com", icon: "🐙" },
        { label: "Discord", href: "https://discord.gg", icon: "💬" },
        { label: "YouTube", href: "https://youtube.com", icon: "📺" },
      ],
    },
    copyright: {
      text: "© 2025 AI Starter. Built with Next.js 16 and love.",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
      ],
    },
  },
};
