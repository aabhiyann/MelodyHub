import { Album, IAlbum } from "../models/album.model.js";
import { BaseService } from "./base.service.js";
import { redisService } from "./redis.service.js";

const CACHE_TTL_ALBUMS = 1800; // 30 min

export class AlbumService extends BaseService<IAlbum> {
	constructor() {
		super(Album);
	}

	/**
	 * Get all albums with pagination
	 */
	async getAllAlbums(page: number = 1, limit: number = 20) {
		const cacheKey = `albums:list:${page}:${limit}`;
		const cached = await redisService.get(cacheKey);
		if (cached) return cached as any;

		const skip = (page - 1) * limit;

		// Get total count for pagination metadata
		const total = await Album.countDocuments();

		// Get paginated albums
		const albums = await Album.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const result = {
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
		await redisService.set(cacheKey, result, CACHE_TTL_ALBUMS);
		return result;
	}

	/**
	 * Get a specific album by ID with its songs populated
	 */
	async getAlbumById(albumId: string) {
		const cacheKey = `album:${albumId}`;
		const cached = await redisService.get(cacheKey);
		if (cached) return cached as any;

		const album = await this.findById(albumId);
		if (!album) throw new Error("Album not found");

		// Populate songs after fetching
		const populated = await album.populate("songs");
		const plain = populated.toObject ? populated.toObject() : populated;
		await redisService.set(cacheKey, plain, CACHE_TTL_ALBUMS);
		return populated;
	}
}
