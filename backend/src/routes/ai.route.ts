import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { AIController } from "../controllers/ai.controller.js";

const router = Router();
const controller = new AIController();

router.post("/generate", protectRoute, controller.generatePlaylist);

export default router;
