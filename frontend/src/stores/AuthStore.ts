
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getErrorMessage } from "@/utils/errors";

interface AuthState {
	authUser: User | null;
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
}

interface AuthActions {
	checkAdminStatus: () => Promise<void>;
	reset: () => void;
	setAuthUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
	authUser: null,
	isAdmin: false,
	isLoading: false,
	error: null,
};

// 🔄 Zustand store for auth
export const useAuthStore = create<AuthStore>()(
	devtools(
		(set) => ({
			...initialState,

			setAuthUser: (user: User | null) => {
				set({ authUser: user }, false, "auth/setUser");
			},

			checkAdminStatus: async () => {
				set({ isLoading: true, error: null }, false, "auth/checkAdmin/pending");
				try {
					const response = await axiosInstance.get<{ admin: boolean }>("/admin/check");
					set({ isAdmin: response.data.admin, isLoading: false }, false, "auth/checkAdmin/success");
				} catch (error) {
					set({
						isAdmin: false,
						error: getErrorMessage(error, "Failed to check admin status"),
						isLoading: false,
					}, false, "auth/checkAdmin/error");
				}
			},

			reset: () => {
				set(initialState, false, "auth/reset");
			},
		}),
		{ name: "AuthStore" }
	)
);