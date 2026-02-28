import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";
import { AuthenticatedRequest } from "../types/index.js";
import { PlaylistService } from "../services/playlist.service.js";

const activityService = new ActivityService();
const playlistService = new PlaylistService();

/**
 * POST /playlists
 * Create a new playlist
 */
export const createPlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { name, description, isPublic, imageUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = await playlistService.createPlaylist(userId, { name, description, isPublic, imageUrl });

        // Create activity
        await activityService.logActivity(userId, ActivityType.CREATE_PLAYLIST, playlist.id);

        return res.status(201).json({
            success: true,
            data: playlist,
            message: "Playlist created",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to create playlist", error: errorMessage });
    }
};

/**
 * GET /playlists
 * Get user's playlists
 */
export const getPlaylists = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlists = await playlistService.getAllPlaylists(userId);

        return res.status(200).json({ success: true, data: playlists, count: playlists.length });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to get playlists", error: errorMessage });
    }
};

/**
 * POST /playlists/:id/songs
 * Add song to playlist
 */
export const addSongToPlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;
        const { songId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = await playlistService.addSong(String(id), songId, userId);

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to add song", error: errorMessage });
    }
};

/**
 * DELETE /playlists/:id/songs/:songId
 * Remove song from playlist
 */
export const removeSongFromPlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id, songId } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = await playlistService.removeSong(String(id), String(songId), userId);
        return res.status(200).json({ success: true, data: playlist, message: "Song removed" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to remove song", error: errorMessage });
    }
};

/**
 * PUT /playlists/:id/songs
 * Reorder playlist songs (body: { songIds: string[] })
 */
export const reorderPlaylistSongs = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;
        const { songIds } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        if (!Array.isArray(songIds)) {
            return res.status(400).json({ success: false, message: "songIds must be an array" });
        }

        const playlist = await playlistService.reorderSongs(String(id), userId, songIds);
        return res.status(200).json({ success: true, data: playlist, message: "Playlist reordered" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to reorder playlist", error: errorMessage });
    }
};

/**
 * POST /playlists/:id/share
 * Share playlist with users
 */
export const sharePlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;
        const { userIds, role } = req.body; // role: 'collaborator' or 'viewer'

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        // This method isn't in PlaylistService yet - keep as is for now
        // Would need to add sharePlaylist method to service
        const { SharedPlaylist } = await import("../models/sharedPlaylist.model.js");
        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Only owner can share
        if (playlist.owner !== userId) {
            return res.status(403).json({ success: false, message: "Only owner can share playlist" });
        }

        // Add users (avoiding duplicates)
        if (role === 'collaborator') {
            const existing = new Set(playlist.collaborators);
            const newIds = userIds.filter((uid: string) => !existing.has(uid));
            playlist.collaborators.push(...newIds);
        } else {
            const existing = new Set(playlist.viewers);
            const newIds = userIds.filter((uid: string) => !existing.has(uid));
            playlist.viewers.push(...newIds);
        }

        await playlist.save();

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to share playlist", error: errorMessage });
    }
};

/**
 * PUT /playlists/:id
 * Update playlist (name, description, isPublic, imageUrl)
 */
export const updatePlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;
        const { name, description, isPublic, imageUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = await playlistService.updatePlaylist(String(id), userId, { name, description, isPublic, imageUrl });

        return res.status(200).json({ success: true, data: playlist, message: "Playlist updated" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to update playlist", error: errorMessage });
    }
};

/**
 * DELETE /playlists/:id
 * Delete playlist
 */
export const deletePlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        await playlistService.deletePlaylist(String(id), userId);

        return res.status(200).json({ success: true, message: "Playlist deleted" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to delete playlist", error: errorMessage });
    }
};

/**
 * GET /playlists/:id
 * Get playlist by ID (public or user access)
 */
export const getPlaylistById = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;

        // Validate ObjectId format
        const playlistId = Array.isArray(id) ? id[0] : id;
        if (!playlistId || typeof playlistId !== 'string' || !playlistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID format"
            });
        }

        const playlist = await playlistService.getPlaylistById(String(playlistId), userId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to get playlist", error: errorMessage });
    }
};
