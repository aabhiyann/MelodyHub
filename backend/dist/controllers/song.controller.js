import { SongService } from "../services/song.service.js";
import { BaseController } from "./base.controller.js";
export class SongController extends BaseController {
    songService;
    constructor() {
        super();
        this.songService = new SongService();
    }
    async getAllSongs(req, res, next) {
        try {
            // Extract pagination params from query string
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            // Validate pagination params - Handled by Zod middleware
            const result = await this.songService.getAllSongs(page, limit);
            this.handleSuccess(res, result, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getFeaturedSongs(req, res, next) {
        try {
            const songs = await this.songService.getFeaturedSongs();
            this.handleSuccess(res, songs, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getMadeForYouSongs(req, res, next) {
        try {
            const songs = await this.songService.getMadeForYouSongs();
            this.handleSuccess(res, songs, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async getTrendingSongs(req, res, next) {
        try {
            const songs = await this.songService.getTrendingSongs();
            this.handleSuccess(res, songs, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
}
