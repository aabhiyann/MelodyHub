import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { LyricsController } from "../controllers/lyrics.controller.js";

const router = Router();
const controller = new LyricsController();

router.get("/:songId", protectRoute, controller.getLyrics.bind(controller));

export default router;
