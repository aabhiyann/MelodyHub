/**
 * ListItem Component
 * Reusable list item with premium micro-interactions
 * Features: hover effects, ripple animation, drag feedback
 */

import { motion } from 'framer-motion';
import { ReactNode, useState, MouseEvent } from 'react';
import { listItemVariants } from '@/lib/animation-variants';
import { cn } from '@/lib/utils';

interface ListItemProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    showRipple?: boolean;
    disabled?: boolean;
}

export const ListItem = ({
    children,
    onClick,
    className,
    showRipple = true,
    disabled = false,
}: ListItemProps) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;

        // Create ripple effect at click position
        if (showRipple) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();

            setRipples((prev) => [...prev, { x, y, id }]);

            // Remove ripple after animation completes
            setTimeout(() => {
                setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
            }, 600);
        }

        onClick?.();
    };

    return (
        <motion.div
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            whileHover={disabled ? undefined : "hover"}
            whileTap={disabled ? undefined : "tap"}
            onClick={handleClick}
            className={cn(
                "relative overflow-hidden cursor-pointer rounded-lg transition-colors will-change-transform",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {children}

            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="ripple-effect"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 10,
                        height: 10,
                    }}
                />
            ))}
        </motion.div>
    );
};

/**
 * ListContainer Component  
 * Wrapper for animated lists with stagger effect
 */
interface ListContainerProps {
    children: ReactNode;
    className?: string;
}

export const ListContainer = ({ children, className }: ListContainerProps) => {
    return (
        <motion.div
            variants={{
                animate: {
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                    },
                },
            }}
            initial="initial"
            animate="animate"
            className={className}
        >
            {children}
        </motion.div>
    );
};
