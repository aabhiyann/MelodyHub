import { motion, Variants } from 'framer-motion';
import { useAIStore } from '@/stores/useAIStore';

interface MelodyMascotProps {
    size?: 'sm' | 'md' | 'lg';
}

const mascotImages: Record<string, string> = {
    idle: '/mascot/melody-default.png',
    listening: '/mascot/melody-default.png',
    thinking: '/mascot/melody-ai.png',
    excited: '/mascot/melody-success.png',
    celebrating: '/mascot/melody-success.png',
    sad: '/mascot/melody-404.png',
};

export const MelodyMascot = ({ size = 'md' }: MelodyMascotProps) => {
    const { mascotState } = useAIStore();

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const variants: Variants = {
        idle: { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0], transition: { duration: 4, repeat: Infinity } },
        listening: { scale: 1.1, rotate: 0, transition: { duration: 0.3 } },
        thinking: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } },
        excited: { y: [0, -10, 0], scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: Infinity } },
        celebrating: { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0], transition: { duration: 0.8, repeat: Infinity } },
        sad: { y: 5, rotate: [0, -5, 0], transition: { duration: 2, repeat: Infinity } }
    };

    const mascotSrc = mascotImages[mascotState] || mascotImages.idle;

    return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} mx-auto mb-6`}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#22C55E]/20 blur-2xl rounded-full animate-pulse" />

            <motion.div
                animate={mascotState}
                variants={variants}
                className="relative z-10 w-full h-full"
            >
                <img
                    src={mascotSrc}
                    alt="Melody AI"
                    className="w-full h-full object-contain drop-shadow-xl"
                />
            </motion.div>

            {/* Thinking Particles */}
            {mascotState === 'thinking' && (
                <div className="absolute -top-4 -right-4">
                    <motion.div
                        animate={{ opacity: [0, 1, 0], y: -20, x: 10 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-2xl"
                    >
                        🎶
                    </motion.div>
                </div>
            )}
        </div>
    );
};
