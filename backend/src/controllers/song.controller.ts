import { Request, Response, NextFunction } from 'express';
import { SongService } from "../services/song.service.js";
import { BaseController } from "./base.controller.js";

export class SongController extends BaseController {
  private songService: SongService;

  constructor() {
    super();
    this.songService = new SongService();
  }

  async getAllSongs(req: Request, res: Response, next: NextFunction) {
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

      const result = await this.songService.getAllSongs(page, limit);
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getFeaturedSongs(req: Request, res: Response, next: NextFunction) {
    try {
      const songs = await this.songService.getFeaturedSongs();
      this.handleSuccess(res, songs);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getMadeForYouSongs(req: Request, res: Response, next: NextFunction) {
    try {
      const songs = await this.songService.getMadeForYouSongs();
      this.handleSuccess(res, songs);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async getTrendingSongs(req: Request, res: Response, next: NextFunction) {
    try {
      const songs = await this.songService.getTrendingSongs();
      this.handleSuccess(res, songs);
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
