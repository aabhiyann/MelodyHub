import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new RecommendationController();

router.get("/similar/:id", controller.getSimilarSongs.bind(controller));
router.get("/discover-weekly", protectRoute, controller.getDiscoverWeekly.bind(controller));

export default router;
