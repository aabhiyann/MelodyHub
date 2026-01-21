/**
 * SkipLink - Accessibility component for keyboard navigation
 * Allows keyboard users to skip to main content
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks - Level A)
 */

import { cn } from '@/lib/utils';

interface SkipLinkProps {
    href?: string;
    children?: React.ReactNode;
    className?: string;
}

export const SkipLink = ({
    href = '#main-content',
    children = 'Skip to main content',
    className
}: SkipLinkProps) => {
    return (
        <a
            href={href}
            className={cn(
                // Hidden by default
                'absolute left-4 top-4 z-[9999]',
                'px-4 py-2 rounded-lg',
                'bg-brand-primary text-white font-semibold',
                'shadow-lg',
                // Screen reader only until focused
                'sr-only focus:not-sr-only',
                // Focus styles
                'focus:outline-none focus:ring-4 focus:ring-brand-primary/50',
                // Smooth transition
                'transition-all duration-200',
                className
            )}
            onClick={(e) => {
                // Ensure focus moves to target
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    (target as HTMLElement).focus();
                    (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
                }
            }}
        >
            {children}
        </a>
    );
};
