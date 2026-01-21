import { Router } from "express";
import {
    getFeaturedSongs,
    getTrendingSongs,
    getMadeForYouSongs,
    getNewReleases,
    getSongsByGenre,
} from "../controllers/discovery.controller.js";
import { CacheStrategies } from "../middleware/cache.middleware.js";

const router = Router();

// Discovery endpoints with caching
router.get("/featured", CacheStrategies.featured, getFeaturedSongs);
router.get("/trending", CacheStrategies.trending, getTrendingSongs);
router.get("/made-for-you", CacheStrategies.recommendations, getMadeForYouSongs);
router.get("/new-releases", CacheStrategies.newReleases, getNewReleases);
router.get("/genres/:genre", CacheStrategies.genre, getSongsByGenre);

export default router;
