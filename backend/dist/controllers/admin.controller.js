import { BaseController } from "./base.controller.js";
import { AdminService } from "../services/admin.service.js";
const adminService = new AdminService();
export class AdminController extends BaseController {
    async createSong(req, res, next) {
        try {
            if (!req.files || !req.files.audioFile || !req.files.imageFile) {
                return res.status(400).json({ message: "Please upload all files" });
            }
            const audioFile = req.files.audioFile;
            const imageFile = req.files.imageFile;
            // Delegate to service (which handles both upload and DB operations)
            const song = await adminService.createSong(req.body, audioFile, imageFile);
            this.handleSuccess(res, song, 201);
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async deleteSong(req, res, next) {
        try {
            const { id } = req.params;
            // Delegate to service
            const result = await adminService.deleteSong(String(id));
            this.handleSuccess(res, result);
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async createAlbum(req, res, next) {
        try {
            const imageFile = req.files?.imageFile;
            // Delegate to service (which handles both upload and DB operations)
            const album = await adminService.createAlbum(req.body, imageFile);
            this.handleSuccess(res, album, 201);
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async deleteAlbum(req, res, next) {
        try {
            const { id } = req.params;
            // Delegate to service
            const result = await adminService.deleteAlbum(String(id));
            this.handleSuccess(res, result);
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
    async checkAdmin(req, res, next) {
        try {
            // Get user from auth middleware
            const userId = req.auth?.userId;
            if (!userId) {
                return this.handleSuccess(res, { admin: false }, 200, true); // ← New format
            }
            // Check if user has admin role (middleware should have attached this)
            const isAdmin = req.auth?.role === 'admin';
            this.handleSuccess(res, { admin: isAdmin }, 200, true); // ← New format
        }
        catch (error) {
            this.handleError(next, error);
        }
    }
}
