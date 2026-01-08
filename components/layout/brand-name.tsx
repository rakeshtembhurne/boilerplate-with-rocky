import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
}

export function BrandName({ className }: BrandNameProps) {
  return (
    <span className={cn(className)}>
      {siteConfig.name}
    </span>
  );
}
