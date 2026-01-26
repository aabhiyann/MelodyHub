/**
 * PageTransition Component
 * Wrapper for smooth page transition animations
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageVariants } from '@/lib/animation-variants';

interface PageTransitionProps {
    children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={shouldReduceMotion ? {} : pageVariants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
