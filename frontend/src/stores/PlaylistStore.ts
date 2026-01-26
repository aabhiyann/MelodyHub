import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Playlist } from "@/types";
import toast from "react-hot-toast";

interface PlaylistStore {
    currentPlaylist: Playlist | null;
    isLoading: boolean;
    error: string | null;
    fetchPlaylistById: (id: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
    currentPlaylist: null,
    isLoading: false,
    error: null,

    fetchPlaylistById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/playlists/${id}`);
            set({ currentPlaylist: response.data.data }); // controller returns { success: true, data: playlist }
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to fetch playlist" });
            toast.error("Failed to load playlist");
        } finally {
            set({ isLoading: false });
        }
    },
}));
