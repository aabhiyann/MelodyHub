import { create } from "zustand";
import { Playlist } from "@/types";
import { getErrorMessage } from "@/utils/errors";
import { playlistApi } from "@/lib/api/playlist";

interface PlaylistState {
    currentPlaylist: Playlist | null;
    userPlaylists: Playlist[];
    isLoading: boolean;
    error: string | null;
}

interface PlaylistActions {
    fetchPlaylistById: (id: string) => Promise<void>;
    fetchUserPlaylists: () => Promise<void>; // Placeholder for future
    createPlaylist: (name: string, description?: string, isPublic?: boolean) => Promise<Playlist | null>;
    updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
    deletePlaylist: (id: string) => Promise<void>;
    addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
    removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
    reorderSongs: (playlistId: string, songIds: string[]) => Promise<void>;
    resetError: () => void;
}

type PlaylistStore = PlaylistState & PlaylistActions;

const initialState: PlaylistState = {
    currentPlaylist: null,
    userPlaylists: [],
    isLoading: false,
    error: null,
};

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
    ...initialState,

    fetchPlaylistById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const playlist = await playlistApi.getById(id);
            set({ currentPlaylist: playlist });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserPlaylists: async () => {
        set({ isLoading: true, error: null });
        try {
            const rawPlaylists = await playlistApi.getAll();
            // Deduplicate by _id to prevent sidebar duplicates
            const seen = new Set<string>();
            const playlists = rawPlaylists.filter(p => {
                if (!p._id || seen.has(p._id)) return false;
                seen.add(p._id);
                return true;
            });
            set({ userPlaylists: playlists });
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    createPlaylist: async (name, description, isPublic) => {
        set({ isLoading: true, error: null });
        try {
            const playlist = await playlistApi.create(name, description, isPublic);
            set(state => ({
                userPlaylists: [...state.userPlaylists, playlist]
            }));
            return playlist;
        } catch (error) {
            set({ error: getErrorMessage(error) });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePlaylist: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const updatedPlaylist = await playlistApi.update(id, updates);
            set(state => ({
                currentPlaylist: state.currentPlaylist?._id === id ? updatedPlaylist : state.currentPlaylist,
                userPlaylists: state.userPlaylists.map(p => p._id === id ? updatedPlaylist : p)
            }));
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePlaylist: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await playlistApi.delete(id);
            set(state => ({
                currentPlaylist: state.currentPlaylist?._id === id ? null : state.currentPlaylist,
                userPlaylists: state.userPlaylists.filter(p => p._id !== id)
            }));
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    addSongToPlaylist: async (playlistId, songId) => {
        set({ isLoading: true, error: null });
        try {
            await playlistApi.addSong(playlistId, songId);
            // Ideally we fetch the updated playlist, but for now we can rely on UI update or refetch
            if (get().currentPlaylist?._id === playlistId) {
                await get().fetchPlaylistById(playlistId);
            }
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        set({ isLoading: true, error: null });
        try {
            await playlistApi.removeSong(playlistId, songId);
            if (get().currentPlaylist?._id === playlistId) {
                // Optimistically remove
                set(state => ({
                    currentPlaylist: state.currentPlaylist ? {
                        ...state.currentPlaylist,
                        songs: state.currentPlaylist.songs.filter((s: { _id?: string } | string) => {
                            const id = typeof s === 'string' ? s : s._id;
                            return id !== songId;
                        })
                    } : null
                }));
            }
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    reorderSongs: async (playlistId, songIds) => {
        set({ isLoading: true, error: null });
        try {
            await playlistApi.reorderSongs(playlistId, songIds);
            if (get().currentPlaylist?._id === playlistId) {
                await get().fetchPlaylistById(playlistId);
            }
        } catch (error) {
            set({ error: getErrorMessage(error) });
        } finally {
            set({ isLoading: false });
        }
    },

    resetError: () => set({ error: null })
}));
