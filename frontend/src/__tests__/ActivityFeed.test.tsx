import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActivitySidebar from '../components/ActivitySidebar';
import { axiosInstance } from '../lib/axios';

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
    useUser: vi.fn(() => ({
        user: {
            id: 'test_user',
            firstName: 'Test',
            lastName: 'User',
            imageUrl: 'http://example.com/me.jpg'
        },
        isSignedIn: true,
        isLoaded: true
    }))
}));

// Mock Axios
vi.mock('../lib/axios', () => ({
    axiosInstance: {
        get: vi.fn()
    }
}));

// Mock scroll area & avatar (UI components)
vi.mock('../components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: any) => <div data-testid="scroll-area">{children}</div>
}));
vi.mock('../components/ui/avatar', () => ({
    Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
    AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
    AvatarFallback: ({ children }: any) => <div>{children}</div>
}));

describe('ActivitySidebar', () => {
    it('renders sidebar header', () => {
        (axiosInstance.get as any).mockResolvedValue({ data: [] });
        render(<ActivitySidebar />);
        expect(screen.getByText('Friend Activity')).toBeInTheDocument();
    });

    it('renders activity list', async () => {
        const mockActivity = {
            _id: '1',
            userId: {
                _id: 'u1',
                fullName: 'Friend One',
                imageUrl: 'http://example.com/one.jpg'
            },
            type: 'like_song',
            targetId: 't1',
            target: {
                title: 'Cool Song',
                artist: 'Cool Artist'
            },
            createdAt: new Date().toISOString()
        };

        (axiosInstance.get as any).mockResolvedValue({
            data: [mockActivity]
        });

        render(<ActivitySidebar />);

        await waitFor(() => {
            expect(screen.getByText('Friend One')).toBeInTheDocument();
            expect(screen.getByText('liked Cool Song')).toBeInTheDocument();
        });
    });

    it('renders empty state', async () => {
        (axiosInstance.get as any).mockResolvedValue({ data: [] });
        render(<ActivitySidebar />);

        await waitFor(() => {
            expect(screen.getByText('No recent activity')).toBeInTheDocument();
        });
    });
});
