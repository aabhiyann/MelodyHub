/**
 * useReducedMotion - Detects and respects user's motion preferences
 * WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions - Level AAA)
 */

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check initial preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

/**
 * Get animation duration based on motion preference
 */
export function useAnimationDuration(defaultDuration: number = 300): number {
    const prefersReducedMotion = useReducedMotion();
    return prefersReducedMotion ? 0 : defaultDuration;
}

/**
 * Get Framer Motion transition config
 */
export function useMotionConfig(config?: any) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return { duration: 0, type: 'tween' };
    }

    return config;
}
