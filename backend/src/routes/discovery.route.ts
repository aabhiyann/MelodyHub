import { Router } from "express";
import { DiscoveryController } from "../controllers/discovery.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { CacheStrategies } from "../middleware/cache.middleware.js";

const router = Router();
const controller = new DiscoveryController();

router.get("/daily-mix", protectRoute, controller.getDailyMix);
router.get("/made-for-you", protectRoute, controller.getMadeForYouSongs);
router.get("/radio/:songId", protectRoute, controller.getRadio);

// Public/Generic discovery routes (cached)
router.get("/trending", CacheStrategies.trending, controller.getTrendingSongs);
router.get("/featured", CacheStrategies.featured, controller.getFeaturedSongs);
router.get("/new-releases", CacheStrategies.newReleases, controller.getNewReleases);
router.get("/genres/:genre", CacheStrategies.genre, controller.getSongsByGenre);

export default router;
