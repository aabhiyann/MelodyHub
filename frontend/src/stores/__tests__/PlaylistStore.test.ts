import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlaylistStore } from '@/stores/PlaylistStore';
import { playlistApi } from '@/lib/api/playlist';

// Mock the API service
vi.mock('@/lib/api/playlist', () => ({
  playlistApi: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addSong: vi.fn(),
    removeSong: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

const mockPlaylist = {
  _id: 'p1',
  name: 'My Playlist',
  description: 'Desc',
  songs: [],
  owner: 'u1',
  collaborators: [],
  viewers: [],
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('PlaylistStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlaylistStore.setState({
      currentPlaylist: null,
      userPlaylists: [],
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePlaylistStore());
    expect(result.current.currentPlaylist).toBeNull();
    expect(result.current.userPlaylists).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchPlaylistById sets currentPlaylist on success', async () => {
    vi.mocked(playlistApi.getById).mockResolvedValue(mockPlaylist);
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.fetchPlaylistById('p1');
    });

    expect(playlistApi.getById).toHaveBeenCalledWith('p1');
    expect(result.current.currentPlaylist).toEqual(mockPlaylist);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetchPlaylistById sets error on failure', async () => {
    vi.mocked(playlistApi.getById).mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.fetchPlaylistById('p1');
    });

    expect(result.current.error).toBe('Not found');
    expect(result.current.currentPlaylist).toBeNull();
  });

  it('createPlaylist adds to userPlaylists on success', async () => {
    const newPlaylist = { ...mockPlaylist, name: 'New Playlist' };
    vi.mocked(playlistApi.create).mockResolvedValue(newPlaylist);
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.createPlaylist('New Playlist', 'Desc', true);
    });

    expect(playlistApi.create).toHaveBeenCalledWith('New Playlist', 'Desc', true);
    expect(result.current.userPlaylists).toContainEqual(newPlaylist);
    expect(result.current.isLoading).toBe(false);
  });

  it('deletePlaylist removes from userPlaylists', async () => {
    // Setup initial state
    usePlaylistStore.setState({ userPlaylists: [mockPlaylist] });
    vi.mocked(playlistApi.delete).mockResolvedValue();
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.deletePlaylist('p1');
    });

    expect(playlistApi.delete).toHaveBeenCalledWith('p1');
    expect(result.current.userPlaylists).toEqual([]);
  });

  it('addSongToPlaylist calls API', async () => {
    vi.mocked(playlistApi.addSong).mockResolvedValue();
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.addSongToPlaylist('p1', 's1');
    });

    expect(playlistApi.addSong).toHaveBeenCalledWith('p1', 's1');
  });
});
