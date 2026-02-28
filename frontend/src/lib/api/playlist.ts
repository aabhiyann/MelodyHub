import { axiosInstance } from "../axios";
import { Playlist } from "@/types";
import { extractData } from "@/utils/apiAdapter";

export const playlistApi = {
    getAll: async (): Promise<Playlist[]> => {
        const response = await axiosInstance.get("/social/playlists");
        return extractData<Playlist[]>(response.data) ?? [];
    },

    getById: async (id: string): Promise<Playlist> => {
        const response = await axiosInstance.get(`/social/playlists/${id}`);
        return extractData<Playlist>(response.data);
    },

    create: async (name: string, description?: string, isPublic: boolean = true): Promise<Playlist> => {
        const response = await axiosInstance.post("/social/playlists", { name, description, isPublic });
        return extractData<Playlist>(response.data);
    },

    update: async (id: string, updates: Partial<Playlist>): Promise<Playlist> => {
        const response = await axiosInstance.put(`/social/playlists/${id}`, updates);
        return extractData<Playlist>(response.data);
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/social/playlists/${id}`);
    },

    addSong: async (playlistId: string, songId: string): Promise<void> => {
        await axiosInstance.post(`/social/playlists/${playlistId}/songs`, { songId });
    },

    removeSong: async (playlistId: string, songId: string): Promise<void> => {
        await axiosInstance.delete(`/social/playlists/${playlistId}/songs/${songId}`);
    },

    reorderSongs: async (playlistId: string, songIds: string[]): Promise<Playlist> => {
        const response = await axiosInstance.put(`/social/playlists/${playlistId}/songs`, { songIds });
        return extractData<Playlist>(response.data);
    }
};
