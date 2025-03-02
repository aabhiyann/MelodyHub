import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
    {
        title: "Ae Dil hai Mushkil",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/1.jpg",
        audioUrl: "/songs/1.mp3",
        duration: 269, 
    },
    {
        title: "Alizeh",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/2.jpg",
        audioUrl: "/songs/2.mp3",
        duration: 282, // 0:41
    },
    {
        title: "Bulleya",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/3.jpg",
        audioUrl: "/songs/3.mp3",
        duration: 349, 
    },
    {
        title: "Channa Mereya",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/4.jpg",
        audioUrl: "/songs/4.mp3",
        duration: 289, 
    },
    {
        title: "Cutiepie",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/5.jpg",
        audioUrl: "/songs/5.mp3",
        duration: 231, 
    },
    {
        title: "The breakup Song",
        artist: "Arijit Singh",
        imageUrl: "/cover-images/6.jpg",
        audioUrl: "/songs/6.mp3",
        duration: 252, 
    },
    
];

const seedSongs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing songs
        await Song.deleteMany({});

        // Insert new songs
        await Song.insertMany(songs);

        console.log("Songs seeded successfully!");
    } catch (error) {
        console.error("Error seeding songs:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSongs();
