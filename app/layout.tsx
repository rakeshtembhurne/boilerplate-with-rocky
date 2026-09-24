import "@/styles/globals.css";

import { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

import { siteConfig } from "@/config/site";
import { DEFAULT_THEME, type ThemeType } from "@/lib/themes";
import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ActiveThemeProvider } from "@/components/active-theme";
import ModalProvider from "@/components/modals/providers";
import { Analytics } from "@/components/providers/analytics";
import { DynamicFontLoader } from "@/components/providers/dynamic-font-loader";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset:
      cookieStore.get("theme_preset")?.value ??
      siteConfig.theme?.default ??
      DEFAULT_THEME.preset,
    scale: cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.scale,
    radius: cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.radius,
    contentLayout:
      cookieStore.get("theme_content_layout")?.value ??
      DEFAULT_THEME.contentLayout,
  } as ThemeType;

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([, value]) => value && value !== "default" && value !== "none")
      .map(([key, value]) => [
        `data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value,
      ]),
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans")}
        {...bodyAttributes}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ActiveThemeProvider initialTheme={themeSettings}>
            <DynamicFontLoader />
            <ModalProvider>{children}</ModalProvider>
            <NextTopLoader
              color="var(--primary)"
              showSpinner={false}
              height={2}
            />
            <Analytics />
            <Toaster position="top-center" richColors closeButton />
            <TailwindIndicator />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
