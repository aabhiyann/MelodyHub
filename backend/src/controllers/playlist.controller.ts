import { Request, Response } from "express";
import { SharedPlaylist, ISharedPlaylist } from "../models/sharedPlaylist.model.js";
import { Activity } from "../models/activity.model.js";
import mongoose from "mongoose";
import { ActivityService } from "../services/activity.service.js";
import { ActivityType } from "../models/activity.model.js";
import { AuthenticatedRequest } from "../types/index.js";

const activityService = new ActivityService();

/**
 * POST /playlists
 * Create a new playlist
 */
export const createPlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { name, description, isPublic } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = new SharedPlaylist({
            name,
            description,
            owner: userId,
            isPublic: isPublic || false,
            collaborators: [],
            viewers: [],
            songs: [],
        });

        await playlist.save();

        // Create activity
        await activityService.logActivity(userId, ActivityType.CREATE_PLAYLIST, (playlist as unknown as ISharedPlaylist).id);

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

        const playlists = await SharedPlaylist.find({
            $or: [
                { owner: userId },
                { collaborators: userId },
                { viewers: userId },
            ],
        }).populate('songs');

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

        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Check permission
        if (playlist.owner !== userId && !playlist.collaborators.includes(userId)) {
            return res.status(403).json({ success: false, message: "No permission to edit this playlist" });
        }

        // Add song
        playlist.songs.push(new mongoose.Types.ObjectId(songId));
        await playlist.save();

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to add song", error: errorMessage });
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

        // Create activity - skipping share activity for now as it's not in our requirements
        /*
        await activityService.logActivity(userId, 'playlist_share', playlist._id.toString());
        */

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to share playlist", error: errorMessage });
    }
};

/**
 * PUT /playlists/:id
 * Update playlist (name, description, isPublic)
 */
export const updatePlaylist = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).auth?.userId;
        const { id } = req.params;
        const { name, description, isPublic } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Only owner can update
        if (playlist.owner !== userId) {
            return res.status(403).json({ success: false, message: "Only owner can update playlist" });
        }

        // Update fields
        if (name !== undefined) playlist.name = name;
        if (description !== undefined) playlist.description = description;
        if (isPublic !== undefined) playlist.isPublic = isPublic;

        await playlist.save();

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

        const playlist = await SharedPlaylist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Only owner can delete
        if (playlist.owner !== userId) {
            return res.status(403).json({ success: false, message: "Only owner can delete playlist" });
        }

        await SharedPlaylist.findByIdAndDelete(id);

        // Activity for delete? Might not need it for feed, or maybe we do.
        // For now let's skip it to simplify.

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

        const playlist = await SharedPlaylist.findById(id).populate('songs');

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Check access
        const isOwner = userId && playlist.owner === userId;
        const isCollaborator = userId && playlist.collaborators.includes(userId);
        const isViewer = userId && playlist.viewers.includes(userId);
        const isPublic = playlist.isPublic;

        if (!isPublic && !isOwner && !isCollaborator && !isViewer) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        return res.status(200).json({ success: true, data: playlist });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ success: false, message: "Failed to get playlist", error: errorMessage });
    }
};
