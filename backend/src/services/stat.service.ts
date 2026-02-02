import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { redisService } from "./redis.service.js";

const CACHE_TTL_STATS = 300; // 5 min

export class StatService {
  async fetchStats() {
    const cacheKey = "stats:summary";
    const cached = await redisService.get(cacheKey);
    if (cached) return cached as any;

    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] = await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Album.countDocuments(),
      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: [],
          },
        },
        {
          $group: {
            _id: "$artist",
          },
        },
        {
          $count: "count",
        },
      ]),
    ]);

    const result = {
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    };
    await redisService.set(cacheKey, result, CACHE_TTL_STATS);
    return result;
  }
}
