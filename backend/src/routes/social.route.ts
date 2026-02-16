import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriends,
    getFriendRequests,
    removeFriend,
    getFriendActivity,
} from "../controllers/social.controller.js";
import {
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
    sharePlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
} from "../controllers/playlist.controller.js";

const router = Router();

// All social routes require authentication
router.use(protectRoute);

// Friend routes
router.post("/friend-request", sendFriendRequest);
router.delete("/friend-request/:id", cancelFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);
router.get("/friends", getFriends);
router.get("/friend-requests", getFriendRequests);
router.delete("/friends/:id", removeFriend);
router.get("/activity", getFriendActivity);

// Playlist routes
router.post("/playlists", createPlaylist);
router.get("/playlists", getPlaylists);
router.get("/playlists/:id", getPlaylistById);
router.put("/playlists/:id", updatePlaylist);
router.delete("/playlists/:id", deletePlaylist);
router.post("/playlists/:id/songs", addSongToPlaylist);
router.post("/playlists/:id/share", sharePlaylist);

export default router;
