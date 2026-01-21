import { Router } from "express";
import { trackPlay, likeSong, getUserPreferences } from "../controllers/analytics.controller.js";

const router = Router();

// Analytics endpoints for tracking user behavior
router.post("/track-play", trackPlay);
router.post("/like-song", likeSong);
router.get("/user-preferences", getUserPreferences);

export default router;
