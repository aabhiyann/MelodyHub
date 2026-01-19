import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // Modern Purple Primary (Melody Brand)
        default:
          "bg-[var(--melody-purple-600)] text-white shadow-md hover:bg-[var(--melody-purple-700)] hover:shadow-[var(--shadow-glow)] hover:scale-105 active:scale-100",

        // Blue Secondary (Social/Info)
        secondary:
          "bg-[var(--melody-blue-500)] text-white shadow-md hover:bg-[var(--melody-blue-600)] hover:shadow-[var(--shadow-glow-blue)] hover:scale-105 active:scale-100",

        // Success/Active (Green)
        success:
          "bg-[var(--melody-green-500)] text-white shadow-md hover:bg-[var(--melody-green-400)] hover:scale-105 active:scale-100",

        // Destructive (Red)
        destructive:
          "bg-[var(--color-error)] text-white shadow-md hover:bg-red-600 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 hover:scale-105 active:scale-100",

        // Outline (Purple border)
        outline:
          "border-2 border-[var(--melody-purple-500)]/30 bg-transparent hover:bg-[var(--melody-purple-500)]/10 hover:border-[var(--melody-purple-500)] text-[var(--color-text-primary)]",

        // Ghost (Minimal)
        ghost:
          "hover:bg-white/5 hover:text-[var(--melody-purple-400)] text-[var(--color-text-secondary)]",

        // Link Style
        link:
          "text-[var(--melody-purple-400)] underline-offset-4 hover:underline hover:text-[var(--melody-purple-600)]",

        // Glassmorphism variant
        glass:
          "glass hover:glass-strong text-[var(--color-text-primary)] hover:border-[var(--melody-purple-500)]/50",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 has-[>svg]:px-8 text-lg font-bold",
        icon: "size-10",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-lg",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
