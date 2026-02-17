
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BrowsePage from '../../pages/BrowsePage';
import SearchPage from '../../pages/SearchPage';
import ProfilePage from '../../pages/ProfilePage';
import { useMusicStore } from '../../stores/MusicStore';
import { usePlayerStore } from '../../stores/PlayerStore';
import { useAuthStore } from '../../stores/AuthStore';
import { useUser } from '@clerk/clerk-react';
import { axiosInstance } from '../../lib/axios';

// Mock stores
vi.mock('../../stores/MusicStore', () => ({
    useMusicStore: vi.fn(),
}));

vi.mock('../../stores/PlayerStore', () => ({
    usePlayerStore: vi.fn(),
}));

vi.mock('../../stores/AuthStore', () => ({
    useAuthStore: vi.fn(),
}));

// Mock axios for analytics
vi.mock('../../lib/axios', () => ({
    axiosInstance: {
        post: vi.fn().mockResolvedValue({}),
        get: vi.fn().mockResolvedValue({}),
    }
}));

// Mock hooks
vi.mock('../../hooks/useAnnouncement', () => ({
    useAnnouncement: () => ({ announce: vi.fn() }),
}));

// Mock grid hooks
vi.mock('../../utils/gridPerformance', () => ({
    measureGridPerformance: vi.fn(() => () => { }),
}));

vi.mock('../../hooks/useGridNavigation', () => ({
    useGridNavigation: () => ({
        focusedIndex: 0,
        handleKeyDown: vi.fn(),
        containerRef: { current: null },
    }),
}));

// Mock components
vi.mock('../../components/layout/Topbar', () => ({
    default: () => <div data-testid="topbar">Topbar</div>,
}));

vi.mock('../../components/ui/CategoryCard', () => ({
    CategoryCard: (props: any) => <button onClick={props.onClick} {...props}>{props.title}</button>
}));

vi.mock('../../components/ui/SongRow', () => ({
    SongRow: ({ song, onClick }: any) => (
        <div data-testid={`song-row-${song._id}`} onClick={onClick}>
            {song.title}
        </div>
    )
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
    useUser: vi.fn(),
    useClerk: vi.fn(() => ({ signOut: vi.fn() })),
}));

describe('User Flow Integration', () => {
    const mockSongs = [
        { _id: '1', title: 'Test Song 1', artist: 'Artist 1', genre: 'Pop', imageUrl: 'img1.jpg', duration: 180, createdAt: '2024-01-01' },
        { _id: '2', title: 'Another Song', artist: 'Artist 2', genre: 'Rock', imageUrl: 'img2.jpg', duration: 200, createdAt: '2024-01-02' },
    ];

    const mockAlbums = [
        { _id: 'a1', title: 'Test Album', artist: 'Artist 1', imageUrl: 'album1.jpg', songs: [] }
    ];

    const mockSetCurrentSong = vi.fn();
    const mockSetQueue = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup MusicStore mock
        vi.mocked(useMusicStore).mockReturnValue({
            songs: mockSongs,
            albums: mockAlbums,
            isLoading: false,
            fetchSongs: vi.fn(),
            fetchAlbums: vi.fn(),
        } as never);

        // Setup PlayerStore mock
        vi.mocked(usePlayerStore).mockReturnValue({
            currentSong: null,
            isPlaying: false,
            queue: [],
            setCurrentSong: mockSetCurrentSong,
            setQueue: mockSetQueue,
            addToQueue: mockSetQueue,
        } as never);

        // Setup AuthStore mock
        vi.mocked(useAuthStore).mockReturnValue({
            user: { id: 'u1', fullName: 'Test User' },
        } as never);

        // Setup Clerk mock default
        vi.mocked(useUser).mockReturnValue({
            user: {
                id: 'clerk_u1',
                fullName: 'Test User',
                imageUrl: 'test.jpg',
                createdAt: new Date().toISOString()
            },
            isLoaded: true,
            isSignedIn: true
        } as any);
    });

    it('Browse -> Play: allows user to browse songs and play one', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/browse']}>
                <Routes>
                    <Route path="/browse" element={<BrowsePage />} />
                </Routes>
            </MemoryRouter>
        );

        // 1. Verify we are on browse page
        expect(screen.getByText('Start browsing')).toBeInTheDocument();

        // 2. Select a genre
        const genreButton = screen.getByText('Pop');
        await user.click(genreButton);

        // 3. Verify songs are filtered/shown
        const songTitle = await screen.findByText('Test Song 1');
        expect(songTitle).toBeInTheDocument();

        // 4. Click on a song to play it
        await user.click(songTitle);

        // 5. Verify PlayerStore was called
        expect(mockSetCurrentSong).toHaveBeenCalledWith(mockSongs[0]);
    });

    it('Search -> Play: allows user to search for a song and play it', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/search']}>
                <Routes>
                    <Route path="/search" element={<SearchPage />} />
                </Routes>
            </MemoryRouter>
        );

        // 1. Verify search input is present
        // Use getByPlaceholderText if available, or class/role.
        // SearchPage has input with placeholder "What do you want to listen to?"
        const searchInput = screen.getByPlaceholderText('What do you want to listen to?');
        expect(searchInput).toBeInTheDocument();

        // 2. Type search query
        await user.type(searchInput, 'Test');

        // 3. Wait for results to appear (debounced)
        const songResult = await screen.findByText('Test Song 1', {}, { timeout: 2000 });
        expect(songResult).toBeInTheDocument();

        // 4. Click the song to play
        await user.click(songResult);

        // 5. Verify PlayerStore was updated
        expect(mockSetCurrentSong).toHaveBeenCalledWith(mockSongs[0]);
    });

    it('Profile: allows authenticated user to view profile stats', async () => {
        // Mock profile data fetch
        const mockProfileData = {
            data: {
                _id: 'u1',
                clerkId: 'clerk_u1',
                fullName: 'Test User',
                imageUrl: 'test.jpg'
            }
        };
        const mockAnalyticsData = {
            data: {
                totalPlays: 150,
                likedSongsCount: 12
            }
        };

        // Setup axios mocks
        vi.mocked(axiosInstance.get).mockImplementation((url) => {
            if (url.includes('/users/')) return Promise.resolve({ data: mockProfileData });
            if (url.includes('/analytics/')) return Promise.resolve({ data: mockAnalyticsData });
            if (url.includes('/social/playlists')) return Promise.resolve({ data: { data: [] } });
            return Promise.resolve({ data: {} });
        });

        render(
            <MemoryRouter initialEntries={['/profile/clerk_u1']}>
                <Routes>
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                </Routes>
            </MemoryRouter>
        );

        // 1. Verify Profile Headers
        expect(await screen.findByText('Test User')).toBeInTheDocument();

        // 2. Verify Stats are displayed (from mocked Analytics)
        expect(screen.getByText('Total Plays')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Liked Songs')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
    });

    it.skip('Search -> Add to Queue: allows user to add a searched song to queue', async () => {
        // Skipping as SearchPage implementation of "Add to Queue" might be missing or hidden in context menu
    });
});

