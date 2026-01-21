/**
 * WaveformVisualization Component
 * Animated waveform bars behind text for musical ambiance
 */

import { motion } from 'framer-motion';

const WaveformVisualization = () => {
    const bars = 40;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="flex items-end justify-center gap-1 h-48">
                {Array.from({ length: bars }).map((_, i) => {
                    const height = Math.random() * 100 + 20;
                    const duration = 0.5 + Math.random() * 0.8;
                    const delay = Math.random() * 0.3;

                    return (
                        <motion.div
                            key={i}
                            className="bg-gradient-to-t from-brand-primary to-accent-blue rounded-full"
                            style={{
                                width: 3,
                                minHeight: 10,
                            }}
                            animate={{
                                height: [`${height}%`, `${Math.random() * 100 + 20}%`, `${height}%`],
                            }}
                            transition={{
                                duration,
                                delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default WaveformVisualization;
