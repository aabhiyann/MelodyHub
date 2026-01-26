/**
 * EmptyState Component
 * Displays when sections have no content with Melody mascot and CTA
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";

interface EmptyStateProps {
    message: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    showMascot?: boolean;
}

export const EmptyState = ({
    message,
    description,
    actionLabel,
    onAction,
    showMascot = true
}: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {/* Melody Mascot with Float Animation */}
            {showMascot && (
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="mb-6 relative"
                >
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full" />

                        {/* Mascot Image */}
                        <img
                            src="/mascot/melody-empty.png"
                            alt="Melody mascot"
                            className="w-32 h-32 relative z-10 object-contain drop-shadow-2xl opacity-90"
                        />

                        {/* Floating Sleepy Zs */}
                        <motion.div
                            className="absolute -top-4 -right-2 text-2xl font-bold text-text-secondary z-20"
                            animate={{
                                opacity: [0, 1, 0],
                                y: -20,
                                x: 10,
                                scale: [0.5, 1, 0.8]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        >
                            Zzz
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Message */}
            <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>

            {description && (
                <p className="text-zinc-400 text-base mb-6 max-w-md">
                    {description}
                </p>
            )}

            {/* CTA Button */}
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-all hover:scale-105"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {actionLabel}
                </Button>
            )}

            {/* Decorative Elements */}
            <div className="mt-8 flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        className="w-2 h-2 rounded-full bg-brand-primary/40"
                    />
                ))}
            </div>
        </motion.div>
    );
};
