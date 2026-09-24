import { SidebarNavItem, SiteConfig } from "types";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "Acme",
  description:
    "A production-ready Next.js 16 starter with authentication, Turso/libSQL, a pluggable CRUD example, and a full theme system.",
  url: siteUrl,
  ogImage: `${siteUrl}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/your-handle",
    github: "https://github.com/your-org/your-repo",
  },
  mailSupport: "support@example.com",
  // Theme settings
  theme: {
    // Default theme for all users (can be overridden by user preferences)
    default: "violet-bloom",
    // Show/hide theme selector icon in the UI
    showThemeIcon: true,
    // Allow users to customize theme (if false, only default theme is used)
    allowCustomTheme: true,
  },
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
