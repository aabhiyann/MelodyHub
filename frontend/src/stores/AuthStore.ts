

// src/stores/authStore.ts
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";
import { create } from "zustand";

interface AuthStoreState {
	authUser: User | null;
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	checkAdminStatus: () => Promise<void>;
	reset: () => void;
	setAuthUser: (user: User | null) => void;
}

// 🔄 Zustand store for auth
export const useAuthStore = create<AuthStoreState>((set) => ({
	authUser: null,
	isAdmin: false,
	isLoading: false,
	error: null,

	setAuthUser: (user: User | null) => {
		set({ authUser: user });
	},

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin, isLoading: false });
		} catch (error: any) {
			set({
				isAdmin: false,
				error: error.response?.data?.message || "Failed to check admin status",
				isLoading: false,
			});
		}
	},

	reset: () => {
		set({
			authUser: null,
			isAdmin: false,
			isLoading: false,
			error: null,
		});
	},
}));