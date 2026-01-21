/**
 * MascotStore - Zustand store for Melody the Turtle mascot
 * Manages mascot state, visibility, messages, and interactions
 */

import { create } from 'zustand';

export type MascotState =
    | 'idle'
    | 'happy'
    | 'excited'
    | 'thinking'
    | 'celebrating'
    | 'encouraging'
    | 'sleeping'
    | 'error'
    | 'loading';

interface MascotMessage {
    text: string;
    duration?: number;
    dismissible?: boolean;
}

interface MascotStore {
    // State
    state: MascotState;
    message: MascotMessage | null;
    isVisible: boolean;
    clickCount: number;
    lastClickTime: number;
    unlockedAnimations: string[];
    position: 'bottom-right' | 'center' | 'top-right';

    // Actions
    setState: (state: MascotState) => void;
    showMessage: (message: string | MascotMessage) => void;
    hideMessage: () => void;
    show: () => void;
    hide: () => void;
    incrementClicks: () => void;
    resetClicks: () => void;
    unlockAnimation: (id: string) => void;
    setPosition: (position: 'bottom-right' | 'center' | 'top-right') => void;
}

export const useMascotStore = create<MascotStore>((set, get) => ({
    // Initial state
    state: 'idle',
    message: null,
    isVisible: false,
    clickCount: 0,
    lastClickTime: 0,
    unlockedAnimations: [],
    position: 'bottom-right',

    // Actions
    setState: (state) => set({ state }),

    showMessage: (message) => {
        const msg: MascotMessage = typeof message === 'string'
            ? { text: message, duration: 5000, dismissible: true }
            : message;

        set({ message: msg });

        // Auto-dismiss if duration is set
        if (msg.duration) {
            setTimeout(() => {
                if (get().message?.text === msg.text) {
                    set({ message: null });
                }
            }, msg.duration);
        }
    },

    hideMessage: () => set({ message: null }),

    show: () => set({ isVisible: true }),

    hide: () => set({ isVisible: false, message: null }),

    incrementClicks: () => {
        const now = Date.now();
        const { clickCount, lastClickTime } = get();

        // Reset if more than 2 seconds since last click
        if (now - lastClickTime > 2000) {
            set({ clickCount: 1, lastClickTime: now });
        } else {
            set({ clickCount: clickCount + 1, lastClickTime: now });
        }
    },

    resetClicks: () => set({ clickCount: 0, lastClickTime: 0 }),

    unlockAnimation: (id) => {
        const { unlockedAnimations } = get();
        if (!unlockedAnimations.includes(id)) {
            set({ unlockedAnimations: [...unlockedAnimations, id] });
        }
    },

    setPosition: (position) => set({ position }),
}));
