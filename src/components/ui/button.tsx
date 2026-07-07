import * as React from "react";

import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default: "border border-[#4e46a8] bg-[#5e54b8] text-white shadow-sm hover:bg-[#4e46a8]",
  secondary: "border border-[#ddd6fe] bg-[#ebe8ff] text-[#5e54b8] hover:bg-[#e2dcff]",
  outline: "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
  ghost: "border border-transparent bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
  destructive: "border border-rose-300 bg-rose-500 text-white hover:bg-rose-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ className, variant = "default", size = "default", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e54b8]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
