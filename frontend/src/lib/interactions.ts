/**
 * Interaction Utilities
 * Reusable animation variants, timings, and utilities for micro-interactions
 */

import { Variants, Transition } from 'framer-motion';

// Animation Timings (ms)
export const TIMINGS = {
    fast: 150,
    normal: 250,
    slow: 350,
    page: 300,
    ripple: 600,
} as const;

// Easing Functions
export const EASINGS = {
    smooth: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    elastic: [0.68, -0.6, 0.32, 1.6] as const,
};

// Spring Configs
export const SPRINGS = {
    gentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
    bouncy: { type: 'spring' as const, stiffness: 500, damping: 15 },
    stiff: { type: 'spring' as const, stiffness: 700, damping: 30 },
};

// Common Animation Variants
export const buttonHover: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: TIMINGS.fast / 1000, ease: EASINGS.smooth },
    },
    tap: {
        scale: 0.98,
    },
};

export const listItemHover: Variants = {
    initial: { y: 0, backgroundColor: 'transparent' },
    hover: {
        y: -2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transition: { duration: TIMINGS.normal / 1000 },
    },
};

export const cardHover: Variants = {
    initial: {
        scale: 1,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    hover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        transition: { duration: TIMINGS.normal / 1000 },
    },
};

// Like Button Animation Sequence
export const likeAnimation = {
    initial: { scale: 1 },
    liked: {
        scale: [1, 1.3, 1],
        transition: {
            duration: 0.3,
            times: [0, 0.4, 1],
            ease: EASINGS.bounce,
        },
    },
};

// Shake Animation (for errors)
export const shakeAnimation = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.4,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
    },
};

// Fade variants
export const fadeVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

// Slide variants
export const slideVariants: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
};

// Stagger children
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: SPRINGS.gentle,
    },
};

// Success Checkmark
export const checkmarkVariants: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0,
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.5, ease: EASINGS.smooth },
            opacity: { duration: 0.2 },
        },
    },
};

// Utility Functions
export const vibrate = (pattern: number | number[] = 50) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};

export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, TIMINGS.ripple);
};
