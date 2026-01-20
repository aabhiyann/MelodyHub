/**
 * CheckmarkIcon Component
 * Animated success checkmark for form validation
 */

import { motion } from 'framer-motion';
import { checkmarkVariants, checkmarkCircleVariants } from '@/lib/animation-variants';

interface CheckmarkIconProps {
    size?: number;
    color?: string;
}

export const CheckmarkIcon = ({
    size = 24,
    color = '#10b981'
}: CheckmarkIconProps) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial="initial"
            animate="animate"
        >
            {/* Circle background */}
            <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="2"
                fill="none"
                variants={checkmarkCircleVariants}
            />

            {/* Checkmark path */}
            <motion.path
                d="M7 12L10.5 15.5L17 9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkmarkVariants}
            />
        </motion.svg>
    );
};
