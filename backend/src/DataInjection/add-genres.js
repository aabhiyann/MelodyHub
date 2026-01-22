import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

// Genre mapping based on artist/song characteristics
const GENRES = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Electronic",
    "Jazz",
    "Classical",
    "Country",
    "Latin",
    "Indie",
    "Metal",
    "Folk"
];

// Intelligent genre assignment based on artist name
const getGenreForArtist = (artist) => {
    const artistLower = artist.toLowerCase();

    // Mapping common artists to genres
    const artistGenreMap = {
        "arijit singh": "Bollywood",
        "shreya ghoshal": "Bollywood",
        "atif aslam": "Pop",
        "nickelback": "Rock",
        "swedish house mafia": "Electronic",
        "miguel": "R&B",
        "drake": "Hip Hop",
        "taylor swift": "Pop",
        "ed sheeran": "Pop",
        "billie eilish": "Pop",
        "the weeknd": "R&B",
        "dua lipa": "Pop",
        "coldplay": "Rock",
        "imagine dragons": "Rock",
        "maroon 5": "Pop",
    };

    // Check for direct match
    for (const [name, genre] of Object.entries(artistGenreMap)) {
        if (artistLower.includes(name)) {
            return genre;
        }
    }

    // Default to a random genre if no match
    return GENRES[Math.floor(Math.random() * GENRES.length)];
};

const addGenresToSongs = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Fetch all songs
        const songs = await Song.find({});
        console.log(`📊 Found ${songs.length} songs in database`);

        if (songs.length === 0) {
            console.log("⚠️  No songs found in database. Run the seed script first!");
            return;
        }

        let updated = 0;
        let skipped = 0;

        for (const song of songs) {
            if (song.genre) {
                console.log(`⏭️  Skipping "${song.title}" - already has genre: ${song.genre}`);
                skipped++;
                continue;
            }

            const genre = getGenreForArtist(song.artist);
            song.genre = genre;

            // Also add some random audio features for AI recommendations
            if (!song.features || Object.keys(song.features).length === 0) {
                song.features = {
                    energy: Math.random(),
                    danceability: Math.random(),
                    valence: Math.random(),
                    acousticness: Math.random(),
                    tempo: Math.floor(Math.random() * 100) + 60, // 60-160 BPM
                };
            }

            await song.save();
            console.log(`✅ Updated "${song.title}" by ${song.artist} → Genre: ${genre}`);
            updated++;
        }

        console.log("\n📈 Summary:");
        console.log(`  ✅ Updated: ${updated} songs`);
        console.log(`  ⏭️  Skipped: ${skipped} songs (already had genre)`);
        console.log(`  📊 Total: ${songs.length} songs`);
        console.log("\n🎉 Genre population complete!");
    } catch (error) {
        console.error("❌ Error adding genres:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
};

addGenresToSongs();
