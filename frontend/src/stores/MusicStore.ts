import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchRadioStation: (songId: string) => Promise<Song[]>;
  fetchDailyMix: () => Promise<Song[]>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  addSong: (songData: FormData) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  fetchRadioStation: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/discovery/radio/${songId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching radio:', error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyMix: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/daily-mix');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching daily mix:', error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success('Song deleted successfully');
    } catch (error: any) {
      console.log('Error in deleteSong', error);
      toast.error('Error deleting song');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success('Album deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete album: ' + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/songs?limit=1000');
      set({ songs: response.data.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/stats');
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get('/albums');
      set({ albums: response.data.albums || [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to fetch albums', albums: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/featured');
      set({ featuredSongs: response.data.data || response.data || [] });
    } catch (error: any) {
      console.error('Error fetching featured songs:', error);
      set({
        error: error?.response?.data?.message || 'Failed to fetch featured songs',
        featuredSongs: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/made-for-you');
      set({ madeForYouSongs: response.data.data || response.data || [] });
    } catch (error: any) {
      console.error('Error fetching made-for-you songs:', error);
      set({
        error: error?.response?.data?.message || 'Failed to fetch personalized songs',
        madeForYouSongs: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/trending');
      set({ trendingSongs: response.data.data || response.data || [] });
    } catch (error: any) {
      console.error('Error fetching trending songs:', error);
      set({
        error: error?.response?.data?.message || 'Failed to fetch trending songs',
        trendingSongs: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addSong: async (songData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/admin/songs', songData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        songs: [...state.songs, response.data.data],
      }));
      toast.success('Song added successfully');
    } catch (error: any) {
      toast.error('Error adding song');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
