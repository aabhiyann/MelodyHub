import { Router } from "express";
import {
    getFeaturedSongs,
    getTrendingSongs,
    getMadeForYouSongs,
    getNewReleases,
    getSongsByGenre,
} from "../controllers/discovery.controller.js";

const router = Router();

// Discovery endpoints
router.get("/featured", getFeaturedSongs);
router.get("/trending", getTrendingSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/new-releases", getNewReleases);
router.get("/genres/:genre", getSongsByGenre);

export default router;
