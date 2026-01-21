/**
 * InstallPrompt - PWA install banner
 * Prompts users to install the app
 */

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';
import { usePWA } from '@/hooks/usePWA';
import { isIOS, showIOSInstallPrompt } from '@/utils/mobile';

export const InstallPrompt = () => {
    const { canInstall, promptInstall, isInstalled } = usePWA();
    const [showPrompt, setShowPrompt] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Don't show if already installed or dismissed
        if (isInstalled || isDismissed) return;

        // Show after 30 seconds
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 30000);

        return () => clearTimeout(timer);
    }, [isInstalled, isDismissed]);

    const handleInstall = async () => {
        const accepted = await promptInstall();
        if (accepted) {
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setIsDismissed(true);
        // Remember dismissal for 7 days
        localStorage.setItem('pwa-dismissed', Date.now().toString());
    };

    // Check if dismissed recently
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) {
                setIsDismissed(true);
            }
        }
    }, []);

    const shouldShow = showPrompt && (canInstall || isIOS()) && !isInstalled && !isDismissed;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
                >
                    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-4 rounded-lg shadow-2xl">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="size-4 text-white" />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Download className="size-6 text-white" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">
                                    Install MelodyHub
                                </h3>
                                <p className="text-sm text-white/90 mb-3">
                                    {isIOS()
                                        ? showIOSInstallPrompt()
                                        : 'Install our app for a better experience with offline access.'}
                                </p>

                                {!isIOS() && (
                                    <button
                                        onClick={handleInstall}
                                        className="px-4 py-2 bg-white text-brand-primary rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                                    >
                                        Install Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
