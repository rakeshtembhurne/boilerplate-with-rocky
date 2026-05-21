"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/shared/icons";
import { BrandName } from "@/components/layout/brand-name";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function NavBar() {
  const scrolled = useScroll(50);
  const { data: session, isPending } = useSession();

  const links = marketingConfig.mainNav;

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scrolled ? "border-b" : ""
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <Icons.logo />
            <BrandName className="text-xl font-bold" />
          </Link>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="hidden md:block"
          >
            <Icons.gitHub className="size-5" />
            <span className="sr-only">GitHub</span>
          </Link>

          {session?.user ? (
            <Link
              href={"/dashboard"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-4"
                variant="default"
                size="sm"
                rounded="xl"
              >
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : !isPending && !session ? (
            <Link href="/auth/sign-in" className="hidden md:flex">
              <Button
                className="gap-2 px-4"
                variant="default"
                size="sm"
                rounded="lg"
              >
                <span>Sign In</span>
                <Icons.arrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Skeleton className="hidden h-9 w-24 rounded-xl lg:flex" />
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
