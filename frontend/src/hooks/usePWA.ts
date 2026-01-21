/**
 * usePWA - Progressive Web App utilities
 * Handle install prompt and PWA state
 */

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        const checkInstalled = () => {
            const isInStandaloneMode =
                window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

            setIsStandalone(isInStandaloneMode);
            setIsInstalled(isInStandaloneMode);
        };

        checkInstalled();

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        // Listen for app installed
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = async () => {
        if (!installPrompt) return false;

        // Show install prompt
        await installPrompt.prompt();

        // Wait for user choice
        const { outcome } = await installPrompt.userChoice;

        // Clear prompt
        setInstallPrompt(null);

        return outcome === 'accepted';
    };

    return {
        installPrompt,
        isInstalled,
        isStandalone,
        canInstall: !!installPrompt,
        promptInstall,
    };
}
