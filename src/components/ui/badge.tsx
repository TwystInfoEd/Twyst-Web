import * as React from "react";

import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border border-[#d7cffd] bg-[#ebe8ff] text-[#5e54b8]",
  secondary: "border border-zinc-200 bg-zinc-50 text-zinc-600",
  outline: "border border-zinc-200 bg-white text-zinc-600",
  destructive: "border border-rose-200 bg-rose-50 text-rose-700",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium leading-none",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
