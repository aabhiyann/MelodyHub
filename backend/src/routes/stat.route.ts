import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { StatController } from "../controllers/stat.controller.js";

const router = Router();
const statController = new StatController();

router.get("/", protectRoute, requireAdmin, statController.getStats.bind(statController));

export default router;
