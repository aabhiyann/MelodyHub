import { cn } from "@/lib/utils";

export const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className={cn(
                "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999]",
                "px-4 py-2 bg-brand-primary text-white font-medium rounded-md shadow-lg ring-2 ring-white",
                "transition-transform transform active:scale-95"
            )}
        >
            Skip to main content
        </a>
    );
};
