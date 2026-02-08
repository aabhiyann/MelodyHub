import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeftSidebar from '../LeftSidebar';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

vi.mock('@/stores/MusicStore', () => ({
    useMusicStore: vi.fn(),
}));

vi.mock('@/stores/AuthStore', () => ({
    useAuthStore: vi.fn(),
}));

vi.mock('@clerk/clerk-react', () => ({
    useUser: vi.fn(),
    useClerk: vi.fn(),
}));

import { useMusicStore } from '@/stores/MusicStore';
import { useAuthStore } from '@/stores/AuthStore';
import { useUser, useClerk } from '@clerk/clerk-react';

describe('LeftSidebar', () => {
    const mockFetchAlbums = vi.fn();
    const mockSignOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useMusicStore as any).mockReturnValue({
            albums: [
                { _id: '1', title: 'Test Album', artist: 'Test Artist', imageUrl: 'img.jpg' }
            ],
            fetchAlbums: mockFetchAlbums,
            isLoading: false,
        });

        (useAuthStore as any).mockReturnValue({
            isAdmin: false,
        });

        (useUser as any).mockReturnValue({
            user: {
                firstName: 'Test',
                lastName: 'User',
                imageUrl: 'user.jpg',
            },
        });

        (useClerk as any).mockReturnValue({
            signOut: mockSignOut,
        });

        (useLocation as any).mockReturnValue({ pathname: '/home' });
    });

    it('renders navigation links correctly', () => {
        render(
            <MemoryRouter>
                <LeftSidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeDefined();
        expect(screen.getByText('Browse')).toBeDefined();
        expect(screen.getByText('Radio')).toBeDefined();
    });

    it('highlights active route', () => {
        (useLocation as any).mockReturnValue({ pathname: '/browse' });

        render(
            <MemoryRouter>
                <LeftSidebar />
            </MemoryRouter>
        );

        const browseLink = screen.getByText('Browse').closest('a');
        expect(browseLink?.className).toContain('border-l-4');
    });

    it('renders admin link only if isAdmin is true', () => {
        (useAuthStore as any).mockReturnValue({ isAdmin: true });

        render(
            <MemoryRouter>
                <LeftSidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Admin')).toBeDefined();
    });

    it('fetches albums on mount', () => {
        render(
            <MemoryRouter>
                <LeftSidebar />
            </MemoryRouter>
        );

        expect(mockFetchAlbums).toHaveBeenCalled();
    });

    it('renders user profile and handles sign out', () => {
        render(
            <MemoryRouter>
                <LeftSidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Test User')).toBeDefined();

        const signOutBtn = screen.getByTitle('Sign Out');
        fireEvent.click(signOutBtn);
        expect(mockSignOut).toHaveBeenCalled();
    });
});
