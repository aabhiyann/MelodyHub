
import { Song } from "../models/song.model.js";

export class SongService {
  async getAllSongs() {
    return await Song.find().sort({ createdAt: -1 });
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