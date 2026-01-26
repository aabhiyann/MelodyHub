import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Config to load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// --- Inline Models ---
const albumSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        imageUrl: { type: String, required: true },
        releaseYear: { type: Number, required: true },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    },
    { timestamps: true }
);
const Album = mongoose.models.Album || mongoose.model("Album", albumSchema);

const songSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: false },
        imageUrl: { type: String, required: true },
        audioUrl: { type: String, required: true },
        duration: { type: Number, required: true },
    },
    { timestamps: true }
);
const Song = mongoose.models.Song || mongoose.model("Song", songSchema);

const seedDatabase = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB via Seed Script");

        // Clear existing data
        await Album.deleteMany({});
        await Song.deleteMany({});
        console.log("Cleared existing data");

        // Create Albums
        const albums = [
            {
                title: "Liquid Glass Dreams",
                artist: "The Antigravities",
                imageUrl: "/cover-images/1.jpg",
                releaseYear: 2025,
            },
            {
                title: "Midnight Echoes",
                artist: "Lunar Drift",
                imageUrl: "/cover-images/2.jpg",
                releaseYear: 2024,
            },
            {
                title: "Neon Horizon",
                artist: "Cyber Soul",
                imageUrl: "/cover-images/3.jpg",
                releaseYear: 2026,
            }
        ];

        const createdAlbums = await Album.insertMany(albums);
        console.log(`Seeded ${createdAlbums.length} albums`);

        // Create Songs for each album
        const songs = [];
        for (const album of createdAlbums) {
            for (let i = 1; i <= 4; i++) {
                songs.push({
                    title: `${album.title} - Track ${i}`,
                    artist: album.artist,
                    imageUrl: album.imageUrl,
                    audioUrl: "/songs/1.mp3",
                    duration: 180 + i * 10,
                    albumId: album._id
                });
            }
        }

        const createdSongs = await Song.insertMany(songs);
        console.log(`Seeded ${createdSongs.length} songs`);

        // Update albums with song IDs
        for (const album of createdAlbums) {
            const albumSongs = createdSongs.filter(s => s.albumId.toString() === album._id.toString());
            album.songs = albumSongs.map(s => s._id);
            await album.save();
        }

        console.log("\n--- Verification Valid IDs ---");
        console.log("Album ID:", createdAlbums[0]._id.toString());
        console.log("------------------------------");

        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
