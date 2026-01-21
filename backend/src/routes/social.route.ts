import { Router } from "express";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getFriendRequests,
    removeFriend,
} from "../controllers/social.controller.js";
import {
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
    sharePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

// Friend routes
router.post("/friend-request", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);
router.get("/friends", getFriends);
router.get("/friend-requests", getFriendRequests);
router.delete("/friends/:id", removeFriend);

// Playlist routes
router.post("/playlists", createPlaylist);
router.get("/playlists", getPlaylists);
router.post("/playlists/:id/songs", addSongToPlaylist);
router.post("/playlists/:id/share", sharePlaylist);

export default router;
