import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { SongController } from "../controllers/song.controller.js";
import { validateQuery } from "../middleware/validate.js";
import { paginationSchema } from "../lib/validators.js";
import { CacheStrategies } from "../middleware/cache.middleware.js";

const router = Router();
const controller = new SongController();

router.get("/", validateQuery(paginationSchema), protectRoute, controller.getAllSongs.bind(controller));
router.get("/featured", CacheStrategies.featured, controller.getFeaturedSongs.bind(controller));
router.get("/made-for-you", controller.getMadeForYouSongs.bind(controller));
router.get("/trending", CacheStrategies.trending, controller.getTrendingSongs.bind(controller));

export default router;
