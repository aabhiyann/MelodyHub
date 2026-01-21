/**
 * useMascot - Convenient hook for mascot interactions
 * Provides easy access to mascot functionality
 */

import { useCallback } from 'react';
import { useMascotStore, MascotState } from '@/stores/MascotStore';

export function useMascot() {
    const store = useMascotStore();

    const showWithMessage = useCallback((state: MascotState, message: string) => {
        store.setState(state);
        store.showMessage(message);
        store.show();
    }, [store]);

    const celebrate = useCallback((message: string = "Awesome! 🎉") => {
        showWithMessage('celebrating', message);
    }, [showWithMessage]);

    const encourage = useCallback((message: string = "You got this! 💪") => {
        showWithMessage('encouraging', message);
    }, [showWithMessage]);

    const think = useCallback((message: string = "Hmm, let me think...") => {
        showWithMessage('thinking', message);
    }, [showWithMessage]);

    const showError = useCallback((message: string = "Oops! Let's try again.") => {
        showWithMessage('error', message);
    }, [showWithMessage]);

    const startLoading = useCallback((message: string = "Loading...") => {
        showWithMessage('loading', message);
    }, [showWithMessage]);

    return {
        // Store
        ...store,

        // Convenient methods
        showWithMessage,
        celebrate,
        encourage,
        think,
        showError,
        startLoading,
    };
}
