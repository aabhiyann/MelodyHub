import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Test environment bypass - inject headers and skip auth check if token is present
axiosInstance.interceptors.request.use((config) => {
	if (typeof window !== 'undefined' && window.localStorage.getItem('TEST_MODE') === 'true') {
		config.headers['x-test-mode'] = 'true';
		config.headers['x-test-user-id'] = 'test-user-123';
	}
	return config;
});
