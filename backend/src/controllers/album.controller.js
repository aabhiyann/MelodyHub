import { AlbumService } from "../services/album.service.js";
import { BaseController } from "./base.controller.js"

export class AlbumController extends BaseController {
  constructor() {
    super();
    this.albumService = new AlbumService();
  }

  getAllAlbums = async (req, res, next) => {
    try {
      const albums = await this.albumService.getAllAlbums();
      this.handleSuccess(res, albums);
    } catch (error) {
      this.handleError(next, error);
    }
  };

  getAlbumById = async (req, res, next) => {
    try {
      const { albumId } = req.params;
      const album = await this.albumService.getAlbumById(albumId);
      this.handleSuccess(res, album);
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({ message: error.message });
      }
      this.handleError(next, error);
    }
  };
}