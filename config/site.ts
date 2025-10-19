import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const siteUrl = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "AI with Rocky",
  description:
    "Get your project off to an explosive start with Auth & User Roles! Harness the power of Next.js 15, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui to build your next big thing.",
  url: siteUrl,
  ogImage: `${siteUrl}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/tembhurnerakesh",
    github: "https://github.com/yourusername/your-repo",
  },
  mailSupport: "support@example.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
];
