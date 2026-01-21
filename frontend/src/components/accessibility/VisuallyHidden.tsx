/**
 * VisuallyHidden - Hides content visually but keeps it accessible to screen readers
 * WCAG 2.1 Best Practice for icon buttons and descriptive text
 */

import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
    children: React.ReactNode;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden = ({
    children,
    className,
    as: Component = 'span'
}: VisuallyHiddenProps) => {
    return (
        <Component className={cn('sr-only', className)}>
            {children}
        </Component>
    );
};
