import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToPlaylistDialog } from '../AddToPlaylistDialog';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { usePlaylistStore } from '@/stores/PlaylistStore';

// Inline mock for react-hot-toast to avoid hoisting issues
vi.mock('react-hot-toast', () => {
    const fn: any = vi.fn();
    fn.error = vi.fn();
    fn.success = vi.fn();
    return { default: fn };
});

vi.mock('@/lib/axios', () => ({
    axiosInstance: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

vi.mock('@/stores/PlaylistStore', () => ({
    usePlaylistStore: vi.fn(),
}));

const mockOnClose = vi.fn();
const mockOnOpenChange = vi.fn();

describe('AddToPlaylistDialog', () => {
    const mockCreatePlaylist = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usePlaylistStore).mockReturnValue({
            createPlaylist: mockCreatePlaylist,
        } as any);
    });

    it('fetches and displays playlists on open', async () => {
        const mockPlaylists = [
            { _id: 'p1', name: 'Chill Vibes', songs: [] },
            { _id: 'p2', name: 'Workout', songs: [] }
        ];
        vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockPlaylists } });

        render(
            <AddToPlaylistDialog
                songId="s1"
                open={true}
                onClose={mockOnClose}
                onOpenChange={mockOnOpenChange}
            />
        );

        expect(axiosInstance.get).toHaveBeenCalledWith('/social/playlists');
        expect(await screen.findByText('Chill Vibes')).toBeInTheDocument();
        expect(screen.getByText('Workout')).toBeInTheDocument();
    });

    it('filters playlists based on search', async () => {
        const user = userEvent.setup();
        const mockPlaylists = [
            { _id: 'p1', name: 'Chill Vibes', songs: [] },
            { _id: 'p2', name: 'Workout', songs: [] }
        ];
        vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockPlaylists } });

        render(
            <AddToPlaylistDialog
                songId="s1"
                open={true}
            />
        );

        await screen.findByText('Chill Vibes');

        const searchInput = screen.getByPlaceholderText('Search playlists...');
        await user.type(searchInput, 'Work');

        expect(screen.queryByText('Chill Vibes')).not.toBeInTheDocument();
        expect(screen.getByText('Workout')).toBeInTheDocument();
    });

    it('adds song to existing playlist', async () => {
        const user = userEvent.setup();
        const mockPlaylists = [{ _id: 'p1', name: 'Chill Vibes', songs: [] }];
        vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockPlaylists } });
        vi.mocked(axiosInstance.post).mockResolvedValue({});

        render(
            <AddToPlaylistDialog
                songId="s1"
                open={true}
                onClose={mockOnClose}
                onOpenChange={mockOnOpenChange}
            />
        );

        const playlistButton = await screen.findByText('Chill Vibes');
        await user.click(playlistButton);

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith('/social/playlists/p1/songs', { songId: 's1' });
        });
        expect(toast.success).toHaveBeenCalledWith('Added to playlist!');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('creates new playlist and adds song', async () => {
        const user = userEvent.setup();
        const mockPlaylists: any[] = [];
        vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockPlaylists } });

        const newPlaylist = { _id: 'p_new', name: 'New List', isPublic: true };
        mockCreatePlaylist.mockResolvedValue(newPlaylist);
        vi.mocked(axiosInstance.post).mockResolvedValue({});

        render(
            <AddToPlaylistDialog
                songId="s1"
                open={true}
            />
        );

        await user.click(screen.getByText('Create New Playlist'));

        const nameInput = screen.getByPlaceholderText('Playlist name...');
        await user.type(nameInput, 'New List');
        await user.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockCreatePlaylist).toHaveBeenCalledWith('New List', '', true);
        });

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith('/social/playlists/p_new/songs', { songId: 's1' });
        });
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Created "New List"'));
    });

    it('shows error if playlist name is empty', async () => {
        const user = userEvent.setup();
        vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: [] } });

        render(
            <AddToPlaylistDialog
                songId="s1"
                open={true}
            />
        );

        await user.click(screen.getByText('Create New Playlist'));
        await user.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please enter a playlist name');
        });
        expect(mockCreatePlaylist).not.toHaveBeenCalled();
    });
});
