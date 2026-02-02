import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { StatController } from "../controllers/stat.controller.js";
import { CacheStrategies } from "../middleware/cache.middleware.js";
const router = Router();
const statController = new StatController();
router.get("/", protectRoute, requireAdmin, CacheStrategies.stats, statController.getStats.bind(statController));
export default router;
