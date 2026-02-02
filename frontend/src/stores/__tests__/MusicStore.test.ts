import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMusicStore } from '@/stores/MusicStore';

vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { axiosInstance } from '@/lib/axios';

const mockSongs = [
  { _id: '1', title: 'Song 1', artist: 'Artist 1', genre: 'Pop', duration: 180 },
  { _id: '2', title: 'Song 2', artist: 'Artist 2', genre: 'Rock', duration: 200 },
];
const mockAlbums = [
  { _id: 'a1', title: 'Album 1', artist: 'Artist 1', songs: [] },
];
const mockStats = { totalSongs: 2, totalAlbums: 1, totalUsers: 0, totalArtists: 0 };

describe('MusicStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMusicStore.setState({
      songs: [],
      albums: [],
      isLoading: false,
      error: null,
      featuredSongs: [],
      trendingSongs: [],
      madeForYouSongs: [],
      stats: { totalSongs: 0, totalAlbums: 0, totalUsers: 0, totalArtists: 0 },
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useMusicStore());
    expect(result.current.songs).toEqual([]);
    expect(result.current.albums).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchSongs sets songs on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchSongs();
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/songs?limit=1000');
    expect(result.current.songs).toEqual(mockSongs);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchSongs sets error on failure', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchSongs();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.songs).toEqual([]);
  });

  it('fetchAlbums sets albums on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { albums: mockAlbums } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchAlbums();
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/albums');
    expect(result.current.albums).toEqual(mockAlbums);
  });

  it('fetchFeaturedSongs sets featuredSongs on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchFeaturedSongs();
    });

    expect(result.current.featuredSongs).toEqual(mockSongs);
  });

  it('fetchStats sets stats on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockStats });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchStats();
    });

    expect(result.current.stats).toEqual(mockStats);
  });

  it('deleteSong removes song from state on success', async () => {
    useMusicStore.setState({ songs: mockSongs });
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.deleteSong('1');
    });

    expect(result.current.songs).toHaveLength(1);
    expect(result.current.songs[0]._id).toBe('2');
  });
});
