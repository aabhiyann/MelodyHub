import { axiosInstance } from "../axios";
import { Playlist } from "@/types";
import { extractData } from "@/utils/apiAdapter";

export const playlistApi = {
    getById: async (id: string): Promise<Playlist> => {
        const response = await axiosInstance.get(`/playlists/${id}`);
        return extractData<Playlist>(response.data);
    },

    create: async (name: string, description?: string, isPublic: boolean = true): Promise<Playlist> => {
        const response = await axiosInstance.post("/playlists", { name, description, isPublic });
        return extractData<Playlist>(response.data);
    },

    update: async (id: string, updates: Partial<Playlist>): Promise<Playlist> => {
        const response = await axiosInstance.put(`/playlists/${id}`, updates);
        return extractData<Playlist>(response.data);
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/playlists/${id}`);
    },

    addSong: async (playlistId: string, songId: string): Promise<void> => {
        await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
    },

    removeSong: async (playlistId: string, songId: string): Promise<void> => {
        await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
    }
};
