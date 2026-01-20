import { motion } from "framer-motion";

interface MelodyAvatarProps {
    state: 'idle' | 'listening' | 'thinking' | 'success' | 'error';
    className?: string;
}

const MelodyAvatar = ({ state, className }: MelodyAvatarProps) => {
    // Animation variants for different states
    const variants = {
        idle: {
            y: [0, -5, 0],
            transition: { repeat: Infinity, duration: 4, ease: "easeInOut" as const }
        },
        listening: {
            scale: 1.1,
            rotate: [0, 5, 0],
            filter: "brightness(1.2)",
            transition: { repeat: Infinity, duration: 2 }
        },
        thinking: {
            rotate: 360,
            transition: { repeat: Infinity, duration: 3, ease: "linear" as const }
        },
        success: {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 }
        },
        error: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 bg-brand-primary/40 rounded-full blur-2xl"
                animate={{
                    opacity: state === 'listening' || state === 'thinking' ? 0.8 : 0.3,
                    scale: state === 'success' ? 1.5 : 1
                }}
            />

            {/* Avatar Image */}
            <motion.img
                src="/melody-mascot.png" // Ensure this asset exists or use a fallback
                alt="Melody AI"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                variants={variants}
                animate={state}
            />

            {/* Status Indicator (Optional) */}
            {state === 'thinking' && (
                <div className="absolute -top-4 -right-4 bg-white text-brand-primary text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    Thinking...
                </div>
            )}
        </div>
    );
};

export default MelodyAvatar;
