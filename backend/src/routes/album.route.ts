import { Router } from "express";
import { AlbumController } from "../controllers/album.controller.js";
import { CacheStrategies } from "../middleware/cache.middleware.js";

const router = Router();
const albumController = new AlbumController();

router.get("/", CacheStrategies.albumsList, albumController.getAllAlbums);
router.get("/:albumId", CacheStrategies.albumById, albumController.getAlbumById);

export default router;
