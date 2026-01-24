import { Request, Response, NextFunction } from 'express';
import { LyricsService } from "../services/lyrics.service.js";
import { BaseController } from "./base.controller.js";

export class LyricsController extends BaseController {
    private lyricsService: LyricsService;

    constructor() {
        super();
        this.lyricsService = new LyricsService();
    }

    async getLyrics(req: Request, res: Response, next: NextFunction) {
        try {
            const songId = req.params.songId as string;
            const lyrics = await this.lyricsService.getLyrics(songId);
            this.handleSuccess(res, { lyrics });
        } catch (error) {
            this.handleError(next, error);
        }
    }
}
