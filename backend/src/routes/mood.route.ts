import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCurrentMood, getPlaylistForMood } from "../controllers/mood.controller.js";

const router = Router();

router.get("/current", protectRoute, getCurrentMood);
router.get("/playlist", getPlaylistForMood); // Optional auth for public mood playlists

export default router;
