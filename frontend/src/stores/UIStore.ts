import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
    isActivityPanelOpen: boolean;
    toggleActivityPanel: () => void;
    setActivityPanelOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            // Default to closed for cleaner UI as per user feedback
            isActivityPanelOpen: false,
            toggleActivityPanel: () => set((state) => ({ isActivityPanelOpen: !state.isActivityPanelOpen })),
            setActivityPanelOpen: (isOpen) => set({ isActivityPanelOpen: isOpen }),
        }),
        {
            name: "ui-store",
            partialize: (state) => ({ isActivityPanelOpen: state.isActivityPanelOpen }), // Persist preference
        }
    )
);
