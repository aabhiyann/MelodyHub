/**
 * Confetti animation for excited/celebrating states
 * Particle effects to add delight
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    size: number;
}

export const Confetti = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate confetti particles
        const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 200 - 100,
            y: 0,
            color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][
                Math.floor(Math.random() * 5)
            ],
            rotation: Math.random() * 360,
            size: Math.random() * 8 + 4,
        }));

        setParticles(newParticles);

        // Clear after animation
        const timer = setTimeout(() => setParticles([]), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        backgroundColor: particle.color,
                        width: particle.size,
                        height: particle.size,
                        borderRadius: '50%',
                        left: '50%',
                        top: '50%',
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                    }}
                    animate={{
                        x: particle.x,
                        y: Math.random() * 200 + 100,
                        opacity: 0,
                        rotate: particle.rotation,
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
};
