/**
 * EmptyStateWithMascot - Empty state component featuring Melody
 * Engaging empty states with mascot personality
 */

import { useMascot } from '@/hooks/useMascot';
import { Mascot } from './Mascot';
import { useEffect } from 'react';
import { getRandomMessage } from '@/utils/mascotMessages';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateWithMascotProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    messageCategory?: keyof typeof import('@/utils/mascotMessages').mascotMessages;
}

export const EmptyStateWithMascot = ({
    icon: Icon,
    title,
    description,
    action,
    messageCategory = 'emptyPlaylist',
}: EmptyStateWithMascotProps) => {
    const mascot = useMascot();

    useEffect(() => {
        // Show mascot with encouraging message
        mascot.setState('encouraging');
        mascot.show();
        mascot.setPosition('center');

        const message = getRandomMessage(messageCategory);
        if (message) {
            mascot.showMessage(message);
        }

        // Cleanup: hide mascot when component unmounts
        return () => {
            mascot.hide();
            mascot.setPosition('bottom-right');
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-md space-y-6"
            >
                {/* Icon */}
                {Icon && (
                    <div className="flex justify-center">
                        <div className="p-4 bg-brand-primary/10 rounded-full">
                            <Icon className="size-12 text-brand-primary" />
                        </div>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}

                {/* Action button */}
                {action && (
                    <button
                        onClick={action.onClick}
                        className="px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
                    >
                        {action.label}
                    </button>
                )}
            </motion.div>

            {/* Mascot appears automatically */}
            <Mascot />
        </div>
    );
};
