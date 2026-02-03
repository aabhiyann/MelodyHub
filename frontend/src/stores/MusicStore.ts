import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { getErrorMessage, logError } from '@/utils/errors';
import { extractData } from '@/utils/apiAdapter';

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
      return extractData<Song[]>(response.data);
    } catch (error) {
      logError('MusicStore.fetchRadioStation', error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyMix: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/daily-mix');
      return extractData<Song[]>(response.data);
    } catch (error) {
      logError('MusicStore.fetchDailyMix', error);
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
    } catch (error) {
      logError('MusicStore.deleteSong', error);
      toast.error(getErrorMessage(error, 'Error deleting song'));
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
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Failed to delete album');
      toast.error(errorMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/songs?limit=1000');
      const paginatedData = extractData<{ data: Song[]; pagination?: any }>(response.data);
      set({ songs: paginatedData.data || [] });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/stats');
      const stats = extractData<Stats>(response.data);
      set({ stats });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get('/albums');
      const data = extractData<{ albums: Album[] }>(response.data);
      set({ albums: data.albums || [] });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to fetch albums'), albums: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      const album = extractData<Album>(response.data);
      set({ currentAlbum: album });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/discovery/featured');
      const songs = extractData<Song[]>(response.data);
      set({ featuredSongs: songs });
    } catch (error) {
      logError('MusicStore.fetchFeaturedSongs', error);
      set({
        error: getErrorMessage(error, 'Failed to fetch featured songs'),
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
      const songs = extractData<Song[]>(response.data);
      set({ madeForYouSongs: songs });
    } catch (error) {
      logError('MusicStore.fetchMadeForYouSongs', error);
      set({
        error: getErrorMessage(error, 'Failed to fetch personalized songs'),
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
      const songs = extractData<Song[]>(response.data);
      set({ trendingSongs: songs });
    } catch (error) {
      logError('MusicStore.fetchTrendingSongs', error);
      set({
        error: getErrorMessage(error, 'Failed to fetch trending songs'),
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
      const newSong = extractData<Song>(response.data);
      set((state) => ({
        songs: [...state.songs, newSong],
      }));
      toast.success('Song added successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error adding song'));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
