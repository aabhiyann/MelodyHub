import { Request, Response, NextFunction } from 'express';
import { BaseController } from "./base.controller.js";
import { UploadedFile } from "express-fileupload";
import { AdminService } from "../services/admin.service.js";

const adminService = new AdminService();

export class AdminController extends BaseController {
  async createSong(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || !req.files.audioFile || !req.files.imageFile) {
        return res.status(400).json({ message: "Please upload all files" });
      }

      const audioFile = req.files.audioFile as UploadedFile;
      const imageFile = req.files.imageFile as UploadedFile;

      // Delegate to service (which handles both upload and DB operations)
      const song = await adminService.createSong(req.body, audioFile, imageFile);

      this.handleSuccess(res, song, 201);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async deleteSong(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delegate to service
      const result = await adminService.deleteSong(String(id));

      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async createAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const imageFile = req.files?.imageFile as UploadedFile;

      // Delegate to service (which handles both upload and DB operations)
      const album = await adminService.createAlbum(req.body, imageFile);

      this.handleSuccess(res, album, 201);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async deleteAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Delegate to service
      const result = await adminService.deleteAlbum(String(id));

      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async checkAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // Get user from auth middleware
      const userId = (req as any).auth?.userId;

      if (!userId) {
        return this.handleSuccess(res, { admin: false }, 200, true); // ← New format
      }

      // Check if user has admin role (middleware should have attached this)
      const isAdmin = (req as any).auth?.role === 'admin';

      this.handleSuccess(res, { admin: isAdmin }, 200, true); // ← New format
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
