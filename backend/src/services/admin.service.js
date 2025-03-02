import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

export class AdminService {
  async uploadToCloudinary(file) {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.log("Error in uploadToCloudinary", error);
      throw new Error("Error uploading to Cloudinary");
    }
  }

  async createSong(data, audioFile, imageFile) {
    const audioUrl = await this.uploadToCloudinary(audioFile);
    const imageUrl = await this.uploadToCloudinary(imageFile);

    const song = new Song({
      ...data,
      audioUrl,
      imageUrl,
      albumId: data.albumId || null,
    });

    await song.save();

    if (data.albumId) {
      await Album.findByIdAndUpdate(data.albumId, {
        $push: { songs: song._id },
      });
    }

    return song;
  }

  async deleteSong(id) {
    const song = await Song.findById(id);

    if (song?.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    return { message: "Song deleted successfully" };
  }

  async createAlbum(data, imageFile) {
    const imageUrl = await this.uploadToCloudinary(imageFile);

    const album = new Album({
      ...data,
      imageUrl,
    });

    await album.save();
    return album;
  }

  async deleteAlbum(id) {
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    return { message: "Album deleted successfully" };
  }
}
