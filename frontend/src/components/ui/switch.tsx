import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
    }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
    // Simple controlled switch logic without radix for now to avoid dependency issues
    const toggle = () => {
        if (onCheckedChange) onCheckedChange(!checked);
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={toggle}
            ref={ref}
            className={cn(
                "peer inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-brand-primary" : "bg-zinc-700/80 hover:bg-zinc-600/80",
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    "pointer-events-none block h-[24px] w-[24px] rounded-full bg-white shadow-md ring-0 transition-transform duration-300",
                    checked ? "translate-x-[22px]" : "translate-x-0"
                )}
            />
        </button>
    )
})
Switch.displayName = "Switch"

export { Switch }
