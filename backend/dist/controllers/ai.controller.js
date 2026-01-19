import { AIService } from "../services/ai.service.js";
import { BaseController } from "./base.controller.js";
export class AIController extends BaseController {
    aiService;
    constructor() {
        super();
        this.aiService = new AIService();
    }
    generatePlaylist = async (req, res, next) => {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ message: "Prompt is required" });
            }
            const songs = await this.aiService.generatePlaylist(prompt);
            this.handleSuccess(res, { songs });
        }
        catch (error) {
            this.handleError(next, error);
        }
    };
}
