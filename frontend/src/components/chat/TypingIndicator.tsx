/**
 * TypingIndicator - Animated three dots for typing status
 * Discord/iMessage style with sequential fade animation
 */

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
    userName?: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
    const dotVariants = {
        initial: { opacity: 0.3 },
        animate: { opacity: 1 },
    };

    return (
        <div className='flex items-center gap-2 px-4 py-2'>
            <div className='flex items-center gap-1 px-4 py-3 rounded-2xl bg-surface-raised'>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className='size-2 rounded-full bg-text-tertiary'
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{
                            repeat: Infinity,
                            duration: 1.4,
                            delay: i * 0.2,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>
            {userName && (
                <span className='text-body-sm text-text-tertiary'>
                    {userName} is typing...
                </span>
            )}
        </div>
    );
};
