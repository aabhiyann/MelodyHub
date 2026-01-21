/**
 * ConfettiEffect Component
 * Particle burst animation for success state
 */

import { motion } from 'framer-motion';

export const ConfettiEffect = () => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 12,
        color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5],
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: particle.color }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                        scale: [0, 1, 0.5],
                        x: Math.cos((particle.angle * Math.PI) / 180) * 80,
                        y: Math.sin((particle.angle * Math.PI) / 180) * 80,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
};
