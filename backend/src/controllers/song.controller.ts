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
      const songs = await this.songService.getAllSongs();
      this.handleSuccess(res, songs);
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
