import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/AuthStore';
import { axiosInstance } from '@/lib/axios';

// Mock axios
vi.mock('@/lib/axios', () => ({
    axiosInstance: {
        get: vi.fn(),
    },
}));

describe('AuthStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAuthStore.setState({
            authUser: null,
            isAdmin: false,
            isLoading: false,
            error: null,
        });
        vi.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            const state = useAuthStore.getState();

            expect(state.authUser).toBeNull();
            expect(state.isAdmin).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });
    });

    describe('setAuthUser', () => {
        it('should set auth user', () => {
            const mockUser = {
                _id: '1',
                clerkId: 'user123',
                fullName: 'Test User',
                imageUrl: 'http://test.com/image.jpg',
            };

            useAuthStore.getState().setAuthUser(mockUser);

            expect(useAuthStore.getState().authUser).toEqual(mockUser);
        });

        it('should clear auth user when null', () => {
            const mockUser = {
                _id: '1',
                clerkId: 'user123',
                fullName: 'Test User',
                imageUrl: 'http://test.com/image.jpg',
            };

            useAuthStore.setState({ authUser: mockUser });
            useAuthStore.getState().setAuthUser(null);

            expect(useAuthStore.getState().authUser).toBeNull();
        });
    });

    describe('checkAdminStatus', () => {
        it('should check admin status successfully', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValueOnce({
                data: { admin: true },
            });

            await useAuthStore.getState().checkAdminStatus();

            expect(axiosInstance.get).toHaveBeenCalledWith('/admin/check');
            expect(useAuthStore.getState().isAdmin).toBe(true);
            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(useAuthStore.getState().error).toBeNull();
        });

        it('should handle non-admin response', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValueOnce({
                data: { admin: false },
            });

            await useAuthStore.getState().checkAdminStatus();

            expect(useAuthStore.getState().isAdmin).toBe(false);
            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(useAuthStore.getState().error).toBeNull();
        });

        it('should handle check admin error', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValueOnce({
                response: { data: { message: 'Unauthorized' } },
            });

            await useAuthStore.getState().checkAdminStatus();

            expect(useAuthStore.getState().isAdmin).toBe(false);
            expect(useAuthStore.getState().error).toBe('Unauthorized');
            expect(useAuthStore.getState().isLoading).toBe(false);
        });

        it('should handle generic error', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValueOnce(
                new Error('Network error')
            );

            await useAuthStore.getState().checkAdminStatus();

            expect(useAuthStore.getState().isAdmin).toBe(false);
            expect(useAuthStore.getState().error).toBe('Network error');
            expect(useAuthStore.getState().isLoading).toBe(false);
        });

        it('should set loading state during check', async () => {
            let loadingDuringCall = false;

            vi.mocked(axiosInstance.get).mockImplementation(async () => {
                loadingDuringCall = useAuthStore.getState().isLoading;
                return { data: { admin: true } };
            });

            await useAuthStore.getState().checkAdminStatus();

            expect(loadingDuringCall).toBe(true);
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe('reset', () => {
        it('should reset all state to initial values', () => {
            const mockUser = {
                _id: '1',
                clerkId: 'user123',
                fullName: 'Test User',
                imageUrl: 'http://test.com/image.jpg',
            };

            useAuthStore.setState({
                authUser: mockUser,
                isAdmin: true,
                isLoading: true,
                error: 'Some error',
            });

            useAuthStore.getState().reset();

            const state = useAuthStore.getState();
            expect(state.authUser).toBeNull();
            expect(state.isAdmin).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });
    });
});
