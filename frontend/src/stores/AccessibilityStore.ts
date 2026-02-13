import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
}

interface AccessibilityActions {
    setHighContrast: (enabled: boolean) => void;
    setLargeText: (enabled: boolean) => void;
    setReducedMotion: (enabled: boolean) => void;
    setScreenReaderOptimized: (enabled: boolean) => void;
    resetSettings: () => void;
}

type AccessibilityStore = AccessibilityState & AccessibilityActions;

const initialState: AccessibilityState = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
};

export const useAccessibilityStore = create<AccessibilityStore>()(
    persist(
        (set) => ({
            ...initialState,

            setHighContrast: (enabled) => set({ highContrast: enabled }),
            setLargeText: (enabled) => set({ largeText: enabled }),
            setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
            setScreenReaderOptimized: (enabled) => set({ screenReaderOptimized: enabled }),

            resetSettings: () => set(initialState),
        }),
        {
            name: 'melody-accessibility-storage',
            partialize: (state) => ({
                highContrast: state.highContrast,
                largeText: state.largeText,
                reducedMotion: state.reducedMotion,
                screenReaderOptimized: state.screenReaderOptimized
            }),
        }
    )
);
