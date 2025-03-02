import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing data
        await Album.deleteMany({});
        await Song.deleteMany({});

        // First, create all songs
        const createdSongs = await Song.insertMany([
            {
                title: "Ae Dil hai Mushkil",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/1.jpg",
                audioUrl: "/songs/1.mp3",
                duration: 269,
                plays: Math.floor(Math.random() * 5000),
            },
            {
                title: "Alizeh",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/2.jpg",
                audioUrl: "/songs/2.mp3",
                duration: 282,
                plays: Math.floor(Math.random() * 5000),
            },
            {
                title: "Bulleya",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/3.jpg",
                audioUrl: "/songs/3.mp3",
                duration: 349,
                plays: Math.floor(Math.random() * 5000),
            },
            {
                title: "Channa Mereya",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/4.jpg",
                audioUrl: "/songs/4.mp3",
                duration: 289,
                plays: Math.floor(Math.random() * 5000),
            },
            {
                title: "Cutiepie",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/5.jpg",
                audioUrl: "/songs/5.mp3",
                duration: 231,
                plays: Math.floor(Math.random() * 5000),
            },
            {
                title: "The breakup Song",
                artist: "Arijit Singh",
                imageUrl: "/cover-images/6.jpg",
                audioUrl: "/songs/6.mp3",
                duration: 252,
                plays: Math.floor(Math.random() * 5000),
            },
        ]);

        // Create albums with references to song IDs
        const albums = [
            {
                title: "Ae Dil Hai Mushkil",
                artist: "Arijit Singh",
                imageUrl: "/albums-images/1.jpg",
                releaseYear: 2016,
                songs: createdSongs.slice(0, 6).map((song) => song._id),
            }
        ];

        // Insert all albums
        const createdAlbums = await Album.insertMany(albums);

        // Update songs with their album references
        for (let i = 0; i < createdAlbums.length; i++) {
            const album = createdAlbums[i];
            const albumSongs = albums[i].songs;

            await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
        }

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
