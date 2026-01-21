import { AlbumService } from "../services/album.service.js";
import { BaseController } from "./base.controller.js";
export class AlbumController extends BaseController {
    albumService;
    constructor() {
        super();
        this.albumService = new AlbumService();
    }
    getAllAlbums = async (req, res, next) => {
        try {
            // Extract pagination params from query string
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            // Validate pagination params
            if (page < 1 || limit < 1 || limit > 100) {
                return res.status(400).json({
                    message: 'Invalid pagination parameters. Page and limit must be positive, limit max is 100',
                });
            }
            const result = await this.albumService.getAllAlbums(page, limit);
            this.handleSuccess(res, result);
        }
        catch (error) {
            this.handleError(next, error);
        }
    };
    getAlbumById = async (req, res, next) => {
        try {
            const { albumId } = req.params;
            const album = await this.albumService.getAlbumById(albumId);
            this.handleSuccess(res, album);
        }
        catch (error) {
            if (error.message === "Album not found") {
                return res.status(404).json({ message: error.message });
            }
            this.handleError(next, error);
        }
    };
}
