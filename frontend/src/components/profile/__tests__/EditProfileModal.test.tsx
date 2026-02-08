import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditProfileModal } from '../EditProfileModal';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

// Mocks
vi.mock('@/lib/axios');
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Radix Dialog often renders into a Portal. 
// Testing library queries default to document.body, so it usually works.
// However, ResizeObserver often causes issues in JSDOM.
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('EditProfileModal', () => {
    const mockOnClose = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockUser = {
        _id: '123',
        clerkId: 'clerk123',
        fullName: 'Test User',
        bio: 'Old Bio',
        location: 'Old Location',
        website: 'https://old.com',
        imageUrl: 'img.jpg',
        isPrivate: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (axiosInstance.put as any).mockResolvedValue({
            data: { success: true, data: { ...mockUser, bio: 'New Bio' } }
        });
    });

    it('does not render when closed', () => {
        render(<EditProfileModal user={mockUser} isOpen={false} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
        expect(screen.queryByText('Edit Profile')).toBeNull();
    });

    it('renders and populates form when open', () => {
        render(<EditProfileModal user={mockUser} isOpen={true} onClose={mockOnClose} onUpdate={mockOnUpdate} />);

        expect(screen.getByText('Edit Profile')).toBeDefined();
        // Check inputs
        expect(screen.getByDisplayValue('Test User')).toBeDefined();
        expect(screen.getByDisplayValue('Old Bio')).toBeDefined();
        expect(screen.getByDisplayValue('Old Location')).toBeDefined();
        expect(screen.getByDisplayValue('https://old.com')).toBeDefined();
    });

    it('updates form state on change', () => {
        render(<EditProfileModal user={mockUser} isOpen={true} onClose={mockOnClose} onUpdate={mockOnUpdate} />);

        const bioInput = screen.getByLabelText('Bio');
        fireEvent.change(bioInput, { target: { value: 'New Bio' } });

        expect(screen.getByDisplayValue('New Bio')).toBeDefined();
    });

    it('submits form successfully', async () => {
        render(<EditProfileModal user={mockUser} isOpen={true} onClose={mockOnClose} onUpdate={mockOnUpdate} />);

        // Change bio
        const bioInput = screen.getByLabelText('Bio');
        fireEvent.change(bioInput, { target: { value: 'New Bio' } });

        // Submit
        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);

        expect(axiosInstance.put).toHaveBeenCalledWith('/users/profile', expect.objectContaining({
            bio: 'New Bio',
            fullName: 'Test User'
        }));

        await waitFor(() => {
            expect(mockOnUpdate).toHaveBeenCalled();
        });
        expect(toast.success).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles submission error', async () => {
        (axiosInstance.put as any).mockRejectedValue(new Error('Update failed'));
        render(<EditProfileModal user={mockUser} isOpen={true} onClose={mockOnClose} onUpdate={mockOnUpdate} />);

        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
