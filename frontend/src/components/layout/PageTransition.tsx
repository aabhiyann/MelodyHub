/**
 * PageTransition Component
 * Wrapper for smooth page transition animations with route-specific variants
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { pageVariants, routeTransitions } from '@/lib/animation-variants';

interface PageTransitionProps {
    children: ReactNode;
}

const getTransitionVariant = (pathname: string) => {
    if (pathname.includes('/chat')) return 'slide';
    if (pathname.includes('/playlists/')) return 'modal';
    if (pathname.includes('/album')) return 'modal';
    if (pathname.includes('/artist')) return 'fade';
    return 'default'; // fadeFast: 150ms opacity
};

export const PageTransition = ({ children }: PageTransitionProps) => {
    const shouldReduceMotion = useReducedMotion();
    const location = useLocation();
    const transitionType = getTransitionVariant(location.pathname);
    const variants = routeTransitions[transitionType] || pageVariants;

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={shouldReduceMotion ? {} : variants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
