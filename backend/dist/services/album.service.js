import { Album } from "../models/album.model.js";
import { BaseService } from "./base.service.js";
export class AlbumService extends BaseService {
    constructor() {
        super(Album);
    }
    /**
     * Get all albums with pagination
     */
    async getAllAlbums(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        // Get total count for pagination metadata
        const total = await Album.countDocuments();
        // Get paginated albums
        const albums = await Album.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return {
            data: albums,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        };
    }
    /**
     * Get a specific album by ID with its songs populated
     */
    async getAlbumById(albumId) {
        const album = await this.findById(albumId);
        if (!album)
            throw new Error("Album not found");
        // Populate songs after fetching
        return await album.populate("songs");
    }
}
