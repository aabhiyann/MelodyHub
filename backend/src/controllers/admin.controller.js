import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { BaseController } from "./base.controller.js"

export class AdminController extends BaseController {
  async createSong(req, res, next) {
    try {
      if (!req.files || !req.files.audioFile || !req.files.imageFile) {
        return res.status(400).json({ message: "Please upload all files" });
      }

      const { title, artist, albumId, duration } = req.body;
      const audioUrl = await this.uploadToCloudinary(req.files.audioFile);
      const imageUrl = await this.uploadToCloudinary(req.files.imageFile);

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

  async deleteSong(req, res, next) {
    try {
      const { id } = req.params;
      const song = await Song.findById(id);

      if (song.albumId) {
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

  async createAlbum(req, res, next) {
    try {
      const { title, artist, releaseYear } = req.body;
      const imageUrl = await this.uploadToCloudinary(req.files.imageFile);

      const album = new Album({ title, artist, imageUrl, releaseYear });
      await album.save();

      this.handleSuccess(res, album, 201);
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async deleteAlbum(req, res, next) {
    try {
      const { id } = req.params;
      await Song.deleteMany({ albumId: id });
      await Album.findByIdAndDelete(id);

      this.handleSuccess(res, { message: "Album deleted successfully" });
    } catch (error) {
      this.handleError(next, error);
    }
  }

  async checkAdmin(req, res, next) {
    this.handleSuccess(res, { admin: true });
  }
}