import { Song } from "../models/song.model.js";
import { redisService } from "./redis.service.js";

const CACHE_TTL_FEATURED = 3600; // 1 hour
const CACHE_TTL_TRENDING = 900; // 15 min
const CACHE_TTL_MADE_FOR_YOU = 21600; // 6 hours

export class SongService {
  async getAllSongs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const cacheKey = `songs:all:${page}:${limit}`;
    const cached = await redisService.get(cacheKey);
    if (cached) return cached as any;

    // Get total count for pagination metadata
    const total = await Song.countDocuments();

    // Get paginated songs
    const songs = await Song.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title artist imageUrl audioUrl duration isFeatured isTrending albumId')
      .lean(); // Use lean() for better performance

    const result = {
      data: songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };

    await redisService.set(cacheKey, result, 60); // Cache for 60 seconds
    return result;
  }

  async getFeaturedSongs() {
    const cacheKey = "songs:featured";
    const cached = await redisService.get(cacheKey);
    if (cached) return cached as any;

    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    await redisService.set(cacheKey, songs, CACHE_TTL_FEATURED);
    return songs;
  }

  async getMadeForYouSongs() {
    const cacheKey = "songs:made-for-you";
    const cached = await redisService.get(cacheKey);
    if (cached) return cached as any;

    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    await redisService.set(cacheKey, songs, CACHE_TTL_MADE_FOR_YOU);
    return songs;
  }

  async getTrendingSongs() {
    const cacheKey = "songs:trending";
    const cached = await redisService.get(cacheKey);
    if (cached) return cached as any;

    const songs = await Song.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select("title artist imageUrl audioUrl")
      .lean();
    await redisService.set(cacheKey, songs, CACHE_TTL_TRENDING);
    return songs;
  }

  async getRandomSongs(limit: number = 10) {
    const songs = await Song.aggregate([
      { $sample: { size: limit } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
          duration: 1
        },
      },
    ]);
    return songs;
  }
}
