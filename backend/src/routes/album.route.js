import { Router } from "express";
import { AlbumController } from "../controllers/album.controller.js";

const router = Router();
const albumController = new AlbumController();

router.get("/", albumController.getAllAlbums);
router.get("/:albumId", albumController.getAlbumById);

export default router;