import { StatService } from "../services/stat.service.js";
import { BaseController } from "./base.controller.js";

export class StatController extends BaseController {
  constructor() {
    super();
    this.statService = new StatService();
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.statService.fetchStats();
      this.handleSuccess(res, stats);
    } catch (error) {
      this.handleError(next, error);
    }
  }
}