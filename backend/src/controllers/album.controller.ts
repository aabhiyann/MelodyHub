import { Request, Response, NextFunction } from 'express';
import { AlbumService } from "../services/album.service.js";
import { BaseController } from "./base.controller.js";

export class AlbumController extends BaseController {
  private albumService: AlbumService;

  constructor() {
    super();
    this.albumService = new AlbumService();
  }

  getAllAlbums = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract pagination params from query string
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // Validate pagination params
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          message: 'Invalid pagination parameters. Page and limit must be positive, limit max is 100',
        });
      }

      const result = await this.albumService.getAllAlbums(page, limit);
      this.handleSuccess(res, result, 200, true); // ← New format
    } catch (error) {
      this.handleError(next, error);
    }
  };

  getAlbumById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { albumId } = req.params;
      const album = await this.albumService.getAlbumById(albumId as string);
      this.handleSuccess(res, album, 200, true); // ← New format
    } catch (error: any) {
      if (error.message === "Album not found") {
        return res.status(404).json({ message: error.message });
      }
      this.handleError(next, error);
    }
  };
}
