import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { MoodController } from "../controllers/mood.controller.js";

const router = Router();

router.get("/current", protectRoute, MoodController.getCurrentMood);
router.get("/playlist", MoodController.getPlaylistForMood); // Optional auth for public mood playlists

export default router;
