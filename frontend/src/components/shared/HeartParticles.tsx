/**
 * HeartParticles Component
 * Creates a particle burst effect for heart/like animations
 */

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { particleVariants } from '@/lib/animation-variants';

interface HeartParticlesProps {
    count?: number;
    color?: string;
    size?: number;
}

export const HeartParticles = ({
    count = 6,
    color = '#ef4444',
    size = 8,
}: HeartParticlesProps) => {
    // Calculate evenly distributed angles for particles
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / count,
        distance: 30 + Math.random() * 20, // Random distance 30-50px
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    custom={particle}
                    variants={particleVariants}
                    initial="initial"
                    animate="animate"
                >
                    <Heart
                        size={size}
                        fill={color}
                        color={color}
                        className="drop-shadow-md"
                    />
                </motion.div>
            ))}
        </div>
    );
};
