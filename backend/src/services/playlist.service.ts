import { SharedPlaylist, ISharedPlaylist } from "../models/sharedPlaylist.model.js";

export class PlaylistService {
    /**
     * Create a new playlist
     */
    async createPlaylist(userId: string, data: { name: string; description?: string; isPublic?: boolean }): Promise<ISharedPlaylist> {
        const playlist = await SharedPlaylist.create({
            ...data,
            owner: userId,
            isPublic: data.isPublic ?? false,
            songs: [],
        });
        return playlist;
    }

    /**
     * Get all playlists for a user
     */
    async getAllPlaylists(userId: string, limit: number = 50, offset: number = 0): Promise<ISharedPlaylist[]> {
        return await SharedPlaylist.find({
            $or: [{ owner: userId }, { isPublic: true }],
        })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();
    }

    /**
     * Get playlist by ID
     */
    async getPlaylistById(id: string, userId?: string): Promise<ISharedPlaylist | null> {
        const playlist = await SharedPlaylist.findById(id).populate("songs").lean();

        if (!playlist) {
            return null;
        }

        // Check access permissions
        if (!playlist.isPublic && userId && (playlist.owner as any).toString() !== userId) {
            throw new Error("Access denied");
        }

        return playlist;
    }

    /**
     * Update playlist
     */
    async updatePlaylist(id: string, userId: string, updates: Partial<ISharedPlaylist>): Promise<ISharedPlaylist | null> {
        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        if ((playlist.owner as any).toString() !== userId) {
            throw new Error("Not authorized");
        }

        // Update allowed fields
        if (updates.name) playlist.name = updates.name;
        if (updates.description !== undefined) playlist.description = updates.description;
        if (updates.isPublic !== undefined) playlist.isPublic = updates.isPublic;

        await playlist.save();
        return playlist;
    }

    /**
     * Delete playlist
     */
    async deletePlaylist(id: string, userId: string): Promise<void> {
        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        if ((playlist.owner as any).toString() !== userId) {
            throw new Error("Not authorized");
        }

        await SharedPlaylist.findByIdAndDelete(id);
    }

    /**
     * Add song to playlist
     */
    async addSong(playlistId: string, songId: string, userId: string): Promise<ISharedPlaylist | null> {
        const playlist = await SharedPlaylist.findById(playlistId);

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        if ((playlist.owner as any).toString() !== userId) {
            throw new Error("Not authorized");
        }

        if (!playlist.songs.includes(songId as any)) {
            playlist.songs.push(songId as any);
            await playlist.save();
        }

        return playlist;
    }

    /**
     * Remove song from playlist
     */
    async removeSong(playlistId: string, songId: string, userId: string): Promise<ISharedPlaylist | null> {
        const playlist = await SharedPlaylist.findById(playlistId);

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        if ((playlist.owner as any).toString() !== userId) {
            throw new Error("Not authorized");
        }

        playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
        await playlist.save();

        return playlist;
    }

    /**
     * Toggle playlist public/private
     */
    async togglePublic(playlistId: string, userId: string): Promise<ISharedPlaylist | null> {
        const playlist = await SharedPlaylist.findById(playlistId);

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        if ((playlist.owner as any).toString() !== userId) {
            throw new Error("Not authorized");
        }

        playlist.isPublic = !playlist.isPublic;
        await playlist.save();

        return playlist;
    }
}
