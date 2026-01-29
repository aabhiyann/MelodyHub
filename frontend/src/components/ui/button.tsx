import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // Primary Brand (Violet)
        default:
          "bg-brand-primary text-primary-foreground shadow-md hover:bg-brand-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",

        // Blue Secondary (Social/Info)
        secondary:
          "bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-100",

        // Success/Active (Green)
        success:
          "bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:scale-105 active:scale-100",

        // Destructive (Red)
        destructive:
          "bg-red-500 text-white shadow-md hover:bg-red-600 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 hover:scale-105 active:scale-100",

        // Outline (Brand border)
        outline:
          "border-2 border-brand-primary/30 bg-transparent hover:bg-brand-primary/10 hover:border-brand-primary text-brand-primary",

        // Ghost (Minimal)
        ghost:
          "hover:bg-white/5 hover:text-brand-primary text-text-secondary",

        // Link Style
        link:
          "text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary/80",

        // Glassmorphism variant
        glass:
          "glass-panel hover:glass-strong text-white hover:border-brand-primary/50",

        // Liquid Premium
        liquid:
          "btn-liquid bg-gradient-brand text-white shadow-glow-primary border border-white/10",
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

export interface ButtonProps
  extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  disabled,
  ...props
}: ButtonProps) {

  // Animation variants for the button
  const animationVariants = {
    initial: { scale: 1 },
    hover: disabled ? {} : {
      scale: variant === 'link' ? 1 : 1.02,
      y: variant === 'link' ? 0 : -1,
    },
    tap: disabled ? {} : {
      scale: 0.98,
      y: 0,
    },
  };

  const buttonClassName = cn(
    buttonVariants({ variant, size, shape, className }),
    "will-change-transform"
  );

  // If asChild, use Slot without Framer Motion
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={buttonClassName}
        {...props}
      />
    );
  }

  // Otherwise use motion.button with animations
  return (
    <motion.button
      data-slot="button"
      className={buttonClassName}
      variants={animationVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{
        type: "tween",
        duration: 0.2,
        ease: "easeOut",
      }}
      disabled={disabled}
      {...(props as any)}
    />
  )
}

export { Button, buttonVariants }

