import {
  AlertTriangle,
  Ban,
  CircleAlert,
  CircleCheckBig,
  FileText,
  Info,
  Lightbulb,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface CalloutProps {
  twClass?: string;
  children?: React.ReactNode;
  type?: keyof typeof dataCallout;
}

const dataCallout = {
  default: {
    icon: Info,
    classes:
      "border-border bg-muted text-foreground",
  },
  danger: {
    icon: CircleAlert,
    classes:
      "border-destructive/50 bg-destructive/10 text-destructive-foreground",
  },
  error: {
    icon: Ban,
    classes:
      "border-destructive/50 bg-destructive/10 text-destructive-foreground",
  },
  idea: {
    icon: Lightbulb,
    classes:
      "border-primary/50 bg-primary/10 text-primary-foreground",
  },
  info: {
    icon: Info,
    classes:
      "border-primary/50 bg-primary/10 text-primary-foreground",
  },
  note: {
    icon: FileText,
    classes:
      "border-primary/50 bg-primary/10 text-primary-foreground",
  },
  success: {
    icon: CircleCheckBig,
    classes:
      "border-accent/50 bg-accent/10 text-accent-foreground",
  },
  warning: {
    icon: AlertTriangle,
    classes:
      "border-destructive/30 bg-destructive/5 text-foreground",
  },
};

export function Callout({
  children,
  twClass,
  type = "default",
  ...props
}: CalloutProps) {
  const { icon: Icon, classes } = dataCallout[type];
  return (
    <div
      className={cn(
        "mt-6 flex items-start space-x-3 rounded-lg border px-4 py-3 text-[15.6px] dark:border-none",
        classes,
        twClass,
      )}
      {...props}
    >
      <div className="mt-1 shrink-0">
        <Icon className="size-5" />
      </div>
      <div className="[&>p]:my-0">{children}</div>
    </div>
  );
}
