import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsersList from '@/components/UsersList';
import { useChatStore } from '@/stores/ChatStore';

// Mock the ChatStore
vi.mock('@/stores/ChatStore', () => ({
    useChatStore: vi.fn(),
}));

describe('UsersList Component', () => {
    const mockSetSelectedUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Loading State', () => {
        it('should show skeleton when loading', () => {
            // TESTING: Component renders loading state correctly
            // COVERAGE: Increases BRANCH coverage (isLoading = true branch)

            vi.mocked(useChatStore).mockReturnValue({
                users: [],
                selectedUser: null,
                isLoading: true,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(),
            } as any);

            render(<UsersList />);

            // Check skeleton is rendered (by checking for specific skeleton class)
            const skeletonElements = screen.getByTestId('users-list-skeleton');
            expect(skeletonElements).toBeInTheDocument();
        });
    });

    describe('User List Display', () => {
        it('should render list of users when loaded', () => {
            // TESTING: Component displays user data correctly
            // COVERAGE: Increases LINES, STATEMENTS, and FUNCTION coverage

            const mockUsers = [
                {
                    _id: '1',
                    clerkId: 'user1',
                    fullName: 'John Doe',
                    imageUrl: 'http://test.com/john.jpg',
                },
                {
                    _id: '2',
                    clerkId: 'user2',
                    fullName: 'Jane Smith',
                    imageUrl: 'http://test.com/jane.jpg',
                },
            ];

            vi.mocked(useChatStore).mockReturnValue({
                users: mockUsers,
                selectedUser: null,
                isLoading: false,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(['user1']),
            } as any);

            render(<UsersList />);

            // Verify both users are displayed
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should highlight selected user', () => {
            // TESTING: Selected user gets special styling
            // COVERAGE: Tests BRANCH (selectedUser?.clerkId === user.clerkId)

            const mockUsers = [
                {
                    _id: '1',
                    clerkId: 'user1',
                    fullName: 'John Doe',
                    imageUrl: 'http://test.com/john.jpg',
                },
            ];

            const selectedUser = mockUsers[0];

            vi.mocked(useChatStore).mockReturnValue({
                users: mockUsers,
                selectedUser,
                isLoading: false,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(),
            } as any);

            const { container } = render(<UsersList />);

            // Check for selected styling
            const selectedElement = container.querySelector('.bg-zinc-800');
            expect(selectedElement).toBeInTheDocument();
        });
    });

    describe('User Interaction', () => {
        it('should call setSelectedUser when clicking a user', async () => {
            // TESTING: Click handlers work correctly
            // COVERAGE: Tests FUNCTION coverage (onClick handler)

            const mockUsers = [
                {
                    _id: '1',
                    clerkId: 'user1',
                    fullName: 'John Doe',
                    imageUrl: 'http://test.com/john.jpg',
                },
            ];

            vi.mocked(useChatStore).mockReturnValue({
                users: mockUsers,
                selectedUser: null,
                isLoading: false,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(),
            } as any);

            render(<UsersList />);

            // Click on the user
            const userElement = screen.getByText('John Doe');
            fireEvent.click(userElement);

            // Verify setSelectedUser was called with correct user
            await waitFor(() => {
                expect(mockSetSelectedUser).toHaveBeenCalledWith(mockUsers[0]);
            });
        });
    });

    describe('Online Status', () => {
        it('should show green indicator for online users', () => {
            // TESTING: Online/offline visual indicators
            // COVERAGE: Tests BRANCH (onlineUsers.has(user.clerkId))

            const mockUsers = [
                {
                    _id: '1',
                    clerkId: 'user1',
                    fullName: 'Online User',
                    imageUrl: 'http://test.com/online.jpg',
                },
                {
                    _id: '2',
                    clerkId: 'user2',
                    fullName: 'Offline User',
                    imageUrl: 'http://test.com/offline.jpg',
                },
            ];

            vi.mocked(useChatStore).mockReturnValue({
                users: mockUsers,
                selectedUser: null,
                isLoading: false,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(['user1']), // Only user1 is online
            } as any);

            const { container } = render(<UsersList />);

            // Check for online indicator (green)
            const onlineIndicator = container.querySelector('.bg-green-500');
            expect(onlineIndicator).toBeInTheDocument();

            // Check for offline indicator (gray)
            const offlineIndicator = container.querySelector('.bg-zinc-500');
            expect(offlineIndicator).toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        it('should handle empty user list', () => {
            // TESTING: Edge case - no users
            // COVERAGE: Tests BRANCH (users.length === 0)

            vi.mocked(useChatStore).mockReturnValue({
                users: [],
                selectedUser: null,
                isLoading: false,
                setSelectedUser: mockSetSelectedUser,
                onlineUsers: new Set(),
            } as any);

            const { container } = render(<UsersList />);

            // Should render empty state
            expect(container.querySelector('.space-y-2')).toBeInTheDocument();
        });
    });
});
