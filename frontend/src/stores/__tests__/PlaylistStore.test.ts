import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlaylistStore } from '@/stores/PlaylistStore';

vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

import { axiosInstance } from '@/lib/axios';

const mockPlaylist = {
  _id: 'p1',
  name: 'My Playlist',
  songs: [],
  userId: 'u1',
  isPublic: true,
};

describe('PlaylistStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlaylistStore.setState({
      currentPlaylist: null,
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePlaylistStore());
    expect(result.current.currentPlaylist).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchPlaylistById sets currentPlaylist on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: { data: mockPlaylist },
    });
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.fetchPlaylistById('p1');
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/playlists/p1');
    expect(result.current.currentPlaylist).toEqual(mockPlaylist);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchPlaylistById sets error on failure', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce({
      response: { data: { message: 'Not found' } },
    });
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.fetchPlaylistById('p1');
    });

    expect(result.current.error).toBe('Not found');
    expect(result.current.currentPlaylist).toBeNull();
  });

  it('fetchPlaylistById uses generic error when no message', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => usePlaylistStore());

    await act(async () => {
      await result.current.fetchPlaylistById('p1');
    });

    expect(result.current.error).toBe('Network error');
  });
});
