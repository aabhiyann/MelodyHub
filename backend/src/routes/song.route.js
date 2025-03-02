
import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { SongController } from "../controllers/song.controller.js";

const router = Router();
const controller = new SongController();

router.get("/", protectRoute, requireAdmin, controller.getAllSongs.bind(controller));
router.get("/featured", controller.getFeaturedSongs.bind(controller));
router.get("/made-for-you", controller.getMadeForYouSongs.bind(controller));
router.get("/trending", controller.getTrendingSongs.bind(controller));

export default router;