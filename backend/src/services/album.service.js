import { Album } from "../models/album.model.js";
import { BaseService } from "./base.service.js";

export class AlbumService extends BaseService {
	constructor() {
		super(Album);
	}

	/**
	 * Get all albums using inherited findAll()
	 */
	async getAllAlbums() {
		return await this.findAll(); // no filter
	}

	/**
	 * Get a specific album by ID with its songs populated
	 */
	async getAlbumById(albumId) {
		const album = await this.findById(albumId);
		if (!album) throw new Error("Album not found");

		// Populate songs after fetching
		return await album.populate("songs");
	}
}
