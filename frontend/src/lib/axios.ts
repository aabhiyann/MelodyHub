import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Add authentication tokens to requests
axiosInstance.interceptors.request.use(async (config) => {
	// Test environment bypass - inject headers if in test mode
	if (typeof window !== 'undefined' && window.localStorage.getItem('TEST_MODE') === 'true') {
		config.headers['x-test-mode'] = 'true';
		config.headers['x-test-user-id'] = 'test-user-123';
		return config;
	}

	// Production: Add Clerk auth token
	try {
		// Get Clerk session token
		const { getToken } = useAuth.getState ? useAuth.getState() : {};

		if (getToken && typeof getToken === 'function') {
			const token = await getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
	} catch (error) {
		// If Clerk is not initialized yet, continue without token
		// The backend will return 401 for protected routes
		console.debug('Clerk auth not available:', error);
	}

	return config;
});
