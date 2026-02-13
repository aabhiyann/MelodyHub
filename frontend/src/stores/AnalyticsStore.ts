import { create } from "zustand";
import { getErrorMessage } from "@/utils/errors";
import { analyticsApi, AnalyticsStats } from "@/lib/api/analytics";

interface AnalyticsState {
    stats: AnalyticsStats | null;
    isLoading: boolean;
    error: string | null;
}

interface AnalyticsActions {
    fetchUserStats: () => Promise<void>;
    resetError: () => void;
}

type AnalyticsStore = AnalyticsState & AnalyticsActions;

const initialState: AnalyticsState = {
    stats: null,
    isLoading: false,
    error: null,
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
    ...initialState,

    fetchUserStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const stats = await analyticsApi.getUserStats();
            set({ stats });
        } catch (error) {
            set({ error: getErrorMessage(error, "Failed to fetch analytics") });
        } finally {
            set({ isLoading: false });
        }
    },

    resetError: () => set({ error: null })
}));
