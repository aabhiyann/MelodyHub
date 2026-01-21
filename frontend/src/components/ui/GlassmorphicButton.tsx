/**
 * GlassmorphicButton - Premium button with liquid glass effect
 * Multiple variants for different contexts
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GlassmorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const GlassmorphicButton = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    fullWidth = false,
    className,
    disabled,
    ...props
}: GlassmorphicButtonProps) => {
    const prefersReducedMotion = useReducedMotion();

    const variantStyles = {
        primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg',
        secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20',
        glass: 'bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/10',
        ghost: 'bg-transparent hover:bg-white/5 text-white',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <motion.button
            className={cn(
                // Base styles
                'relative rounded-lg font-semibold',
                'transition-all duration-300',
                'flex items-center justify-center gap-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                // Variant & size
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && 'w-full',
                className
            )}
            whileHover={!disabled && !prefersReducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!disabled && !prefersReducedMotion ? { scale: 0.98 } : undefined}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : icon ? (
                <span>{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
};
