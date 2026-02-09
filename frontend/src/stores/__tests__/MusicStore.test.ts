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
  { _id: '1', title: 'Song 1', artist: 'Artist 1', genre: 'Pop', duration: 180, imageUrl: 'img1', audioUrl: 'url1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { _id: '2', title: 'Song 2', artist: 'Artist 2', genre: 'Rock', duration: 200, imageUrl: 'img2', audioUrl: 'url2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];
const mockAlbums = [
  { _id: 'a1', title: 'Album 1', artist: 'Artist 1', songs: [], imageUrl: 'img1', releaseYear: 2024 },
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
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { success: true, data: mockSongs } });
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

  it('fetchRadioStation sets data on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { success: true, data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchRadioStation('1');
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/discovery/radio/1');
  });

  it('fetchDailyMix sets data on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { success: true, data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchDailyMix();
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/discovery/daily-mix');
  });

  it('fetchMadeForYouSongs sets madeForYouSongs on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { success: true, data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchMadeForYouSongs();
    });

    expect(result.current.madeForYouSongs).toEqual(mockSongs);
  });

  it('fetchTrendingSongs sets trendingSongs on success', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { success: true, data: mockSongs } });
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchTrendingSongs();
    });

    expect(result.current.trendingSongs).toEqual(mockSongs);
  });

  it('deleteAlbum removes album from state on success', async () => {
    useMusicStore.setState({ albums: mockAlbums });
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.deleteAlbum('a1');
    });

    expect(result.current.albums).toHaveLength(0);
  });

  it('addSong adds song to state on success', async () => {
    const newSong = { _id: '3', title: 'Song 3', artist: 'Artist 3', genre: 'Pop', duration: 200 };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { success: true, data: newSong } });
    const { result } = renderHook(() => useMusicStore());

    const formData = new FormData();
    formData.append('title', 'Song 3');

    await act(async () => {
      await result.current.addSong(formData);
    });

    expect(result.current.songs).toContainEqual(newSong);
  });

  it('fetchFeaturedSongs handles error correctly', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchFeaturedSongs();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.featuredSongs).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetchMadeForYouSongs handles error correctly', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchMadeForYouSongs();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.madeForYouSongs).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetchTrendingSongs handles error correctly', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useMusicStore());

    await act(async () => {
      await result.current.fetchTrendingSongs();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.trendingSongs).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
