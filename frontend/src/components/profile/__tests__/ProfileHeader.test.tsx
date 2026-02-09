import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileHeader } from '../ProfileHeader';
import { axiosInstance } from '@/lib/axios';
// import { useNavigate } from 'react-router-dom'; // Removed unused import
import toast from 'react-hot-toast';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('@/lib/axios');
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('ProfileHeader', () => {
    const mockOnEdit = vi.fn();
    const mockUser = {
        _id: '123',
        clerkId: 'clerk123',
        fullName: 'Test User',
        imageUrl: 'img.jpg',
        isFollowing: false,
        followersCount: 10,
        followingCount: 5,
        bio: 'Test Bio',
        location: 'Test Location',
        website: 'https://test.com',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // (useNavigate as any).mockReturnValue(mockNavigate); // No longer needed
        (axiosInstance.post as any).mockResolvedValue({ data: { success: true } });
    });

    it('renders user details', () => {
        render(<ProfileHeader user={mockUser} isOwnProfile={false} />);
        expect(screen.getByText('Test User')).toBeDefined();
        expect(screen.getByText('Test Bio')).toBeDefined();
        // Location and website might be visually hidden or iconic?
        // Let's check text content.
        expect(screen.getByText('Test Location')).toBeDefined();
        expect(screen.getByText('test.com')).toBeDefined(); // Stripped protocol
        expect(screen.getByText('10')).toBeDefined(); // Followers
        expect(screen.getByText('5')).toBeDefined(); // Following
    });

    it('shows edit button for own profile', () => {
        render(<ProfileHeader user={mockUser} isOwnProfile={true} onEdit={mockOnEdit} />);
        // There are two edit buttons (desktop and mobile), so getAllByText or getByText with selector.
        // Or specific accessible name.
        const editBtns = screen.getAllByText(/Edit Profile/i);
        expect(editBtns.length).toBeGreaterThan(0);

        fireEvent.click(editBtns[0]);
        expect(mockOnEdit).toHaveBeenCalled();
    });

    it('handles follow toggle', async () => {
        render(<ProfileHeader user={mockUser} isOwnProfile={false} />);

        const followBtn = screen.getByText('Follow');
        fireEvent.click(followBtn);

        expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringMatching(/\/users\/follow\/123/));

        await waitFor(() => {
            expect(screen.getByText('Following')).toBeDefined();
        });
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Following'));
        expect(screen.getByText('11')).toBeDefined();
    });

    it('handles unfollow toggle', async () => {
        const followingUser = { ...mockUser, isFollowing: true, followersCount: 11 };
        render(<ProfileHeader user={followingUser} isOwnProfile={false} />);

        // Use allByText and filter or find precise button
        const followingBtn = screen.getAllByText('Following').find(el => el.tagName === 'BUTTON');
        expect(followingBtn).toBeDefined();
        fireEvent.click(followingBtn!);

        expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringMatching(/\/users\/unfollow\/123/));

        await waitFor(() => {
            expect(screen.getByText('Follow')).toBeDefined();
        });
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Unfollowed'));
        expect(screen.getByText('10')).toBeDefined();
    });

    it('navigates to followers list', () => {
        render(<ProfileHeader user={mockUser} isOwnProfile={false} />);

        const followersBtn = screen.getByText(/Followers/).closest('button');
        expect(followersBtn).toBeDefined();
        fireEvent.click(followersBtn!);

        expect(mockNavigate).toHaveBeenCalledWith('/followers/123');
    });
});
