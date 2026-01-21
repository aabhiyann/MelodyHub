/**
 * ParticleBackground Component
 * Animated particles (music notes/dots) floating in background
 */

import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

export const ParticleBackground = () => {
    // Generate 25 particles with random positions and delays
    const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        isMusicNote: Math.random() > 0.7, // 30% chance of being a music note
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.x}%`,
                        top: '-5%',
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        opacity: [0, 1, 1, 0],
                        rotate: particle.isMusicNote ? [0, 360] : 0,
                    }}
                    transition={{
                        duration: 15 + Math.random() * 5, // 15-20s
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'linear',
                    }}
                >
                    {particle.isMusicNote ? (
                        <Music2 className="w-4 h-4 text-brand-primary" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                </motion.div>
            ))}
        </div>
    );
};
