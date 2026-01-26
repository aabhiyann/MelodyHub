import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new ActivityController();

router.get("/", protectRoute, controller.getFeed.bind(controller));

export default router;
