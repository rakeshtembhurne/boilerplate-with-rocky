import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="w-full py-12 sm:py-20 lg:py-24">
      <div className="container mx-auto flex max-w-screen-md flex-col items-center gap-5 px-4 text-center">
        <Link
          href={siteConfig.links.github}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span> Powered by {siteConfig.name}
        </Link>

        <h1 className="text-balance font-satoshi text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Next.js Template with{" "}
          <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
            Auth & User Roles!
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Minimalist. Sturdy. <strong>Open Source</strong>.
          <br className="hidden sm:inline" /> Focus on your own idea and... Nothing else!
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/docs"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "w-full gap-2 px-5 sm:w-auto",
            )}
          >
            <span>Installation Guide</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                rounded: "xl",
                size: "lg",
              }),
              "w-full gap-2 px-5 sm:w-auto",
            )}
          >
            <Icons.gitHub className="size-4" />
            <span>
              <span className="hidden sm:inline-block">Star on</span> GitHub
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
