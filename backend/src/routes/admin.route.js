import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();
const adminController = new AdminController();

router.use(protectRoute, requireAdmin);

router.get("/check", adminController.checkAdmin.bind(adminController));
router.post("/songs", adminController.createSong.bind(adminController));
router.delete("/songs/:id", adminController.deleteSong.bind(adminController));
router.post("/albums", adminController.createAlbum.bind(adminController));
router.delete("/albums/:id", adminController.deleteAlbum.bind(adminController));

export default router;