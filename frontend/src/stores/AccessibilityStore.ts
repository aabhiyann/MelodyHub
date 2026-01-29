import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;

    // Actions
    setHighContrast: (enabled: boolean) => void;
    setLargeText: (enabled: boolean) => void;
    setReducedMotion: (enabled: boolean) => void;
    setScreenReaderOptimized: (enabled: boolean) => void;
    resetSettings: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
    persist(
        (set) => ({
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReaderOptimized: false,

            setHighContrast: (enabled) => set({ highContrast: enabled }),
            setLargeText: (enabled) => set({ largeText: enabled }),
            setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
            setScreenReaderOptimized: (enabled) => set({ screenReaderOptimized: enabled }),

            resetSettings: () => set({
                highContrast: false,
                largeText: false,
                reducedMotion: false,
                screenReaderOptimized: false
            }),
        }),
        {
            name: 'melody-accessibility-storage',
        }
    )
);
