

// src/stores/authStore.ts
import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

/**
 * Object-Oriented Zustand store to manage admin authentication status.
 * Applies OOP principles: encapsulation, abstraction, and clean separation of concerns.
 */
class AuthStore {
	private _isAdmin = false;
	private _isLoading = false;
	private _error: string | null = null;

	// Getters
	get isAdmin() {
		return this._isAdmin;
	}
	get isLoading() {
		return this._isLoading;
	}
	get error() {
		return this._error;
	}

	// Async action to check if current user is an admin
	checkAdminStatus = async () => {
		this._isLoading = true;
		this._error = null;

		try {
			const response = await axiosInstance.get("/admin/check");
			this._isAdmin = response.data.admin;
		} catch (error: any) {
			this._isAdmin = false;
			this._error = error.response?.data?.message || "Failed to check admin status";
		} finally {
			this._isLoading = false;
		}
	};

	// Reset store state
	reset = () => {
		this._isAdmin = false;
		this._isLoading = false;
		this._error = null;
	};
}

// 🔄 Zustand wrapper using the class-based store
export const useAuthStore = create(() => {
	const store = new AuthStore();

	return {
		get isAdmin() {
			return store.isAdmin;
		},
		get isLoading() {
			return store.isLoading;
		},
		get error() {
			return store.error;
		},
		checkAdminStatus: store.checkAdminStatus,
		reset: store.reset,
	};
});