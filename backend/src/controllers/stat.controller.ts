import { Request, Response, NextFunction } from 'express';
import { StatService } from "../services/stat.service.js";
import { BaseController } from "./base.controller.js";

export class StatController extends BaseController {
  private statService: StatService;

  constructor() {
    super();
    this.statService = new StatService();
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.statService.fetchStats();
      this.handleSuccess(res, stats, 200, true); // ← New format
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
