/**
 * PageTransition Component
 * Wrapper for smooth page transition animations
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageVariants } from '@/lib/animation-variants';

interface PageTransitionProps {
    children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
