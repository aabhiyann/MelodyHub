import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, "ref"> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, ...props }, ref) => {
    const [shouldShake, setShouldShake] = React.useState(false);

    // Trigger shake animation when hasError changes to true
    React.useEffect(() => {
      if (hasError) {
        setShouldShake(true);
        const timer = setTimeout(() => setShouldShake(false), 500);
        return () => clearTimeout(timer);
      }
    }, [hasError]);

    return (
      <motion.input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "focus:focus-glow",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          shouldShake && "animate-shake-enhanced",
          className
        )}
        animate={shouldShake ? {
          x: [0, -8, 8, -8, 8, 0],
        } : {}}
        transition={{
          duration: 0.4,
          ease: [0.36, 0.07, 0.19, 0.97],
        }}
        aria-invalid={hasError}
        {...(props as any)}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }


