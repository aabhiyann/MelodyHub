import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePlaylistStore } from '../PlaylistStore';
import { playlistApi } from '@/lib/api/playlist';

// Mock the API service
vi.mock('@/lib/api/playlist', () => ({
  playlistApi: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addSong: vi.fn(),
    removeSong: vi.fn()
  }
}));

describe('usePlaylistStore', () => {
  beforeEach(() => {
    usePlaylistStore.setState({
      currentPlaylist: null,
      userPlaylists: [],
      isLoading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  it('initializes correctly', () => {
    const state = usePlaylistStore.getState();
    expect(state.currentPlaylist).toBeNull();
    expect(state.userPlaylists).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('fetchPlaylistById updates state', async () => {
    const mockPlaylist = { _id: '1', name: 'Test' };
    // @ts-ignore
    playlistApi.getById.mockResolvedValue(mockPlaylist);

    await usePlaylistStore.getState().fetchPlaylistById('1');

    const state = usePlaylistStore.getState();
    expect(state.currentPlaylist).toEqual(mockPlaylist);
    expect(state.isLoading).toBe(false);
  });

  it('createPlaylist updates userPlaylists', async () => {
    const mockPlaylist = { _id: '2', name: 'New' };
    // @ts-ignore
    playlistApi.create.mockResolvedValue(mockPlaylist);

    await usePlaylistStore.getState().createPlaylist('New', 'Desc', true);

    const state = usePlaylistStore.getState();
    expect(state.userPlaylists).toContainEqual(mockPlaylist);
  });

  it('addSongToPlaylist calls API', async () => {
    // @ts-ignore
    playlistApi.addSong.mockResolvedValue();
    // @ts-ignore
    playlistApi.getById.mockResolvedValue({ _id: '1', songs: ['s1'] });

    // Setup current playlist
    usePlaylistStore.setState({ currentPlaylist: { _id: '1', songs: [] } as any });

    await usePlaylistStore.getState().addSongToPlaylist('1', 's1');

    expect(playlistApi.addSong).toHaveBeenCalledWith('1', 's1');
    // Should refetch
    expect(playlistApi.getById).toHaveBeenCalledWith('1');
  });

  it('removeSongFromPlaylist optimistically updates', async () => {
    // Setup initial state with songs
    const initialPlaylist = { _id: '1', songs: [{ _id: 's1' }, { _id: 's2' }] };
    usePlaylistStore.setState({ currentPlaylist: initialPlaylist as any });

    // @ts-ignore
    playlistApi.removeSong.mockResolvedValue();

    await usePlaylistStore.getState().removeSongFromPlaylist('1', 's1');

    const state = usePlaylistStore.getState();
    // s1 should be gone
    expect(state.currentPlaylist?.songs).toHaveLength(1);
    expect(state.currentPlaylist?.songs[0]._id).toBe('s2');
  });
});
