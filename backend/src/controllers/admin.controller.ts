import { Request, Response, NextFunction } from 'express';
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { BaseController } from "./base.controller.js";
import { UploadedFile } from "express-fileupload";

export class AdminController extends BaseController {
  async createSong(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || !req.files.audioFile || !req.files.imageFile) {
        return res.status(400).json({ message: "Please upload all files" });
      }

      const { title, artist, albumId, duration } = req.body;
      const audioFile = req.files.audioFile as UploadedFile;
      const imageFile = req.files.imageFile as UploadedFile;

      const audioUrl = await this.uploadToCloudinary(audioFile);
      const imageUrl = await this.uploadToCloudinary(imageFile);

      const song = new Song({
        title,
        artist,
        audioUrl,
        imageUrl,
        duration,
        albumId: albumId || null,
      });

      await song.save();

      if (albumId) {
        await Album.findByIdAndUpdate(albumId, {
          $push: { songs: song._id },
        });
      }

      this.handleSuccess(res, song, 201);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async deleteSong(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const song = await Song.findById(id);

      if (song?.albumId) {
        await Album.findByIdAndUpdate(song.albumId, {
          $pull: { songs: song._id },
        });
      }

      await Song.findByIdAndDelete(id);
      this.handleSuccess(res, { message: "Song deleted successfully" });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async createAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, artist, releaseYear } = req.body;
      const imageFile = req.files?.imageFile as UploadedFile;
      const imageUrl = await this.uploadToCloudinary(imageFile);

      const album = new Album({ title, artist, imageUrl, releaseYear });
      await album.save();

      this.handleSuccess(res, album, 201);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async deleteAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await Song.deleteMany({ albumId: id });
      await Album.findByIdAndDelete(id);

      this.handleSuccess(res, { message: "Album deleted successfully" });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async checkAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // Get user from auth middleware
      const userId = (req as any).auth?.userId;

      if (!userId) {
        return this.handleSuccess(res, { admin: false });
      }

      // Check if user has admin role (middleware should have attached this)
      const isAdmin = (req as any).auth?.role === 'admin';

      this.handleSuccess(res, { admin: isAdmin });
    } catch (error) {
      this.handleError(next, error);
    }
  }
}
