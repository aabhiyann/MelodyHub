import { Router } from "express";
import { DiscoveryController } from "../controllers/discovery.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new DiscoveryController();

router.get("/daily-mix", protectRoute, controller.getDailyMix);
router.get("/made-for-you", controller.getMadeForYouSongs);
router.get("/radio/:songId", controller.getRadio);

// Public/Generic discovery routes
router.get("/trending", controller.getTrendingSongs);
router.get("/featured", controller.getFeaturedSongs);
router.get("/new-releases", controller.getNewReleases);
router.get("/genres/:genre", controller.getSongsByGenre);

export default router;
