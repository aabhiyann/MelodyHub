import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getErrorMessage, logError } from '@/utils/errors';
import { extractData } from '@/utils/apiAdapter';

interface MusicState {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
}

interface MusicActions {
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

type MusicStore = MusicState & MusicActions;

const initialState: MusicState = {
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
};

export const useMusicStore = create<MusicStore>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchRadioStation: async (songId) => {
        set({ isLoading: true, error: null }, false, 'music/fetchRadio/pending');
        try {
          const response = await axiosInstance.get(`/discovery/radio/${songId}`);
          return extractData<Song[]>(response.data);
        } catch (error) {
          logError('MusicStore.fetchRadioStation', error);
          return [];
        } finally {
          set({ isLoading: false }, false, 'music/fetchRadio/settled');
        }
      },

      fetchDailyMix: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchDailyMix/pending');
        try {
          const response = await axiosInstance.get('/discovery/daily-mix');
          return extractData<Song[]>(response.data);
        } catch (error) {
          logError('MusicStore.fetchDailyMix', error);
          return [];
        } finally {
          set({ isLoading: false }, false, 'music/fetchDailyMix/settled');
        }
      },

      deleteSong: async (id) => {
        set({ isLoading: true, error: null }, false, 'music/deleteSong/pending');
        try {
          await axiosInstance.delete(`/admin/songs/${id}`);

          set((state) => ({
            songs: state.songs.filter((song) => song._id !== id),
          }), false, 'music/deleteSong/success');
          toast.success('Song deleted successfully');
        } catch (error) {
          logError('MusicStore.deleteSong', error);
          toast.error(getErrorMessage(error, 'Error deleting song'));
        } finally {
          set({ isLoading: false }, false, 'music/deleteSong/settled');
        }
      },

      deleteAlbum: async (id) => {
        set({ isLoading: true, error: null }, false, 'music/deleteAlbum/pending');
        try {
          await axiosInstance.delete(`/admin/albums/${id}`);
          set((state) => ({
            albums: state.albums.filter((album) => album._id !== id),
            songs: state.songs.map((song) =>
              song.albumId === state.albums.find((a) => a._id === id)?.title
                ? { ...song, album: null }
                : song
            ),
          }), false, 'music/deleteAlbum/success');
          toast.success('Album deleted successfully');
        } catch (error) {
          const errorMsg = getErrorMessage(error, 'Failed to delete album');
          toast.error(errorMsg);
        } finally {
          set({ isLoading: false }, false, 'music/deleteAlbum/settled');
        }
      },

      fetchSongs: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchSongs/pending');
        try {
          const response = await axiosInstance.get('/songs?limit=1000');
          const paginatedData = extractData<{ data: Song[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>(response.data);
          set({ songs: paginatedData.data || [] }, false, 'music/fetchSongs/success');
        } catch (error) {
          set({ error: getErrorMessage(error) }, false, 'music/fetchSongs/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchSongs/settled');
        }
      },

      fetchStats: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchStats/pending');
        try {
          const response = await axiosInstance.get('/stats');
          const stats = extractData<Stats>(response.data);
          set({ stats }, false, 'music/fetchStats/success');
        } catch (error) {
          set({ error: getErrorMessage(error) }, false, 'music/fetchStats/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchStats/settled');
        }
      },

      fetchAlbums: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchAlbums/pending');

        try {
          const response = await axiosInstance.get('/albums');
          const data = extractData<{ albums: Album[] }>(response.data);
          set({ albums: data.albums || [] }, false, 'music/fetchAlbums/success');
        } catch (error) {
          set({ error: getErrorMessage(error, 'Failed to fetch albums'), albums: [] }, false, 'music/fetchAlbums/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchAlbums/settled');
        }
      },

      fetchAlbumById: async (id) => {
        set({ isLoading: true, error: null }, false, 'music/fetchAlbumById/pending');
        try {
          const response = await axiosInstance.get(`/albums/${id}`);
          const album = extractData<Album>(response.data);
          set({ currentAlbum: album }, false, 'music/fetchAlbumById/success');
        } catch (error) {
          set({ error: getErrorMessage(error) }, false, 'music/fetchAlbumById/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchAlbumById/settled');
        }
      },

      fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchFeatured/pending');
        try {
          const response = await axiosInstance.get('/discovery/featured');
          const songs = extractData<Song[]>(response.data);
          set({ featuredSongs: songs }, false, 'music/fetchFeatured/success');
        } catch (error) {
          logError('MusicStore.fetchFeaturedSongs', error);
          set({
            error: getErrorMessage(error, 'Failed to fetch featured songs'),
            featuredSongs: [],
          }, false, 'music/fetchFeatured/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchFeatured/settled');
        }
      },

      fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchMadeForYou/pending');
        try {
          const response = await axiosInstance.get('/discovery/made-for-you');
          const songs = extractData<Song[]>(response.data);
          set({ madeForYouSongs: songs }, false, 'music/fetchMadeForYou/success');
        } catch (error) {
          logError('MusicStore.fetchMadeForYouSongs', error);
          set({
            error: getErrorMessage(error, 'Failed to fetch personalized songs'),
            madeForYouSongs: [],
          }, false, 'music/fetchMadeForYou/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchMadeForYou/settled');
        }
      },

      fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null }, false, 'music/fetchTrending/pending');
        try {
          const response = await axiosInstance.get('/discovery/trending');
          const songs = extractData<Song[]>(response.data);
          set({ trendingSongs: songs }, false, 'music/fetchTrending/success');
        } catch (error) {
          logError('MusicStore.fetchTrendingSongs', error);
          set({
            error: getErrorMessage(error, 'Failed to fetch trending songs'),
            trendingSongs: [],
          }, false, 'music/fetchTrending/error');
        } finally {
          set({ isLoading: false }, false, 'music/fetchTrending/settled');
        }
      },

      addSong: async (songData) => {
        set({ isLoading: true, error: null }, false, 'music/addSong/pending');
        try {
          const response = await axiosInstance.post('/admin/songs', songData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const newSong = extractData<Song>(response.data);
          set((state) => ({
            songs: [...state.songs, newSong],
          }), false, 'music/addSong/success');
          toast.success('Song added successfully');
        } catch (error) {
          toast.error(getErrorMessage(error, 'Error adding song'));
          throw error;
        } finally {
          set({ isLoading: false }, false, 'music/addSong/settled');
        }
      },
    }),
    { name: "MusicStore" }
  )
);
