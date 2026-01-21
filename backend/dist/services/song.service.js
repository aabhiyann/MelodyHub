import { Song } from "../models/song.model.js";
export class SongService {
    async getAllSongs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        // Get total count for pagination metadata
        const total = await Song.countDocuments();
        // Get paginated songs
        const songs = await Song.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance
        return {
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
    }
    async getFeaturedSongs() {
        return await Song.aggregate([
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
    }
    async getMadeForYouSongs() {
        return await Song.aggregate([
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
    }
    async getTrendingSongs() {
        return await Song.find({})
            .sort({ createdAt: -1 })
            .limit(4)
            .select("title artist imageUrl audioUrl");
    }
}
