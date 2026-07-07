import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#027FE3]/40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#027FE3] text-white hover:bg-[#026fc7] shadow-md",

        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md",

        outline:
          "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white",

        secondary:
          "bg-[#EE6707] text-white hover:bg-[#d85d06] shadow-md",

        ghost:
          "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",

        link:
          "text-[#027FE3] underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
