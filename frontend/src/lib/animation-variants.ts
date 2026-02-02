/**
 * Centralized Framer Motion Animation Variants
 * Provides consistent animations across the MelodyHub application
 */

import { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITIONS & PHYSICS
// ============================================

export const transitions = {
    // Smooth ease-out for most interactions
    smooth: {
        type: 'tween',
        duration: 0.2,
        ease: 'easeOut',
    } as Transition,

    // Bouncy spring for playful interactions
    spring: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
    } as Transition,

    // Gentle spring for subtle movements
    gentleSpring: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    } as Transition,

    // Quick snap for immediate feedback
    snap: {
        type: 'tween',
        duration: 0.15,
        ease: [0.34, 1.56, 0.64, 1], // Custom cubic-bezier
    } as Transition,

    // Page transitions
    page: {
        type: 'tween',
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
    } as Transition,
};

// ============================================
// BUTTON VARIANTS
// ============================================

export const buttonVariants: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        y: -2,
        transition: transitions.smooth,
    },
    tap: {
        scale: 0.95,
        y: 0,
        transition: transitions.snap,
    },
};

export const iconButtonVariants: Variants = {
    initial: {
        scale: 1,
        rotate: 0,
    },
    hover: {
        scale: 1.1,
        rotate: 5,
        transition: transitions.gentleSpring,
    },
    tap: {
        scale: 0.9,
        rotate: 0,
        transition: transitions.snap,
    },
};

// ============================================
// HEART/LIKE ANIMATION VARIANTS
// ============================================

export const heartVariants: Variants = {
    unliked: {
        scale: 1,
        transition: transitions.gentleSpring,
    },
    liked: {
        scale: [1, 1.3, 1],
        transition: {
            duration: 0.4,
            times: [0, 0.5, 1],
            ease: [0.175, 0.885, 0.32, 1.275],
        },
    },
};

export const heartGlowVariants: Variants = {
    initial: {
        scale: 0.8,
        opacity: 0,
    },
    animate: {
        scale: 1.5,
        opacity: [0, 1, 0],
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// ============================================
// PARTICLE BURST VARIANTS
// ============================================

export const particleVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 1,
    },
    animate: (custom: { angle: number; distance: number }) => ({
        scale: [0, 1, 0.5],
        opacity: [1, 1, 0],
        x: Math.cos(custom.angle) * custom.distance,
        y: Math.sin(custom.angle) * custom.distance,
        transition: {
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
        },
    }),
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: transitions.page,
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: transitions.page,
    },
};

// Route-specific transition variants
export const routeTransitions: Record<string, Variants> = {
    default: pageVariants,
    
    modal: {
        initial: {
            opacity: 0,
            scale: 0.95,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: transitions.smooth,
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: transitions.smooth,
        },
    },
    
    slide: {
        initial: {
            opacity: 0,
            x: 100,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: transitions.page,
        },
        exit: {
            opacity: 0,
            x: -100,
            transition: transitions.page,
        },
    },
    
    fade: {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
    },
};

export const fadeVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: transitions.smooth,
    },
    exit: {
        opacity: 0,
        transition: transitions.smooth,
    },
};

// ============================================
// LIST ITEM VARIANTS
// ============================================

export const listItemVariants: Variants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: transitions.smooth,
    },
    hover: {
        y: -2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transition: transitions.smooth,
    },
    tap: {
        scale: 0.98,
        transition: transitions.snap,
    },
};

export const listContainerVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

// ============================================
// FORM INPUT VARIANTS
// ============================================

export const inputVariants: Variants = {
    initial: {
        scale: 1,
    },
    focus: {
        scale: 1.01,
        transition: transitions.smooth,
    },
    error: {
        x: [0, -4, 4, -4, 4, 0],
        transition: {
            duration: 0.4,
            ease: [0.36, 0.07, 0.19, 0.97],
        },
    },
};

// ============================================
// TOAST NOTIFICATION VARIANTS
// ============================================

export const toastVariants: Variants = {
    initial: {
        opacity: 0,
        x: 100,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

// ============================================
// MODAL/DIALOG VARIANTS
// ============================================

export const modalBackdropVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.2,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

export const modalContentVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.2,
        },
    },
};

// ============================================
// LOADING PROGRESS BAR VARIANTS
// ============================================

export const progressBarVariants: Variants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    animate: {
        scaleX: 1,
        transition: {
            duration: 0.8,
            ease: [0.65, 0, 0.35, 1],
        },
    },
    exit: {
        scaleX: 0,
        originX: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// ============================================
// CARD HOVER VARIANTS
// ============================================

export const cardVariants: Variants = {
    initial: {
        scale: 1,
        y: 0,
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        },
    },
    tap: {
        scale: 0.98,
        transition: transitions.snap,
    },
};

// ============================================
// SKELETON PULSE VARIANTS
// ============================================

export const skeletonPulseVariants: Variants = {
    initial: {
        opacity: 0.5,
    },
    animate: {
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// ============================================
// RIPPLE EFFECT VARIANT
// ============================================

export const rippleVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0.5,
    },
    animate: {
        scale: 2,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// ============================================
// CHECKMARK SUCCESS VARIANTS
// ============================================

export const checkmarkVariants: Variants = {
    initial: {
        pathLength: 0,
        opacity: 0,
    },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

export const checkmarkCircleVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0,
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20,
        },
    },
};
