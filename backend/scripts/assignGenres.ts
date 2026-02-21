/**
 * One-time migration script to assign genres to songs that lack them.
 * Uses artist-based heuristics and distributes remaining songs evenly across genres.
 * 
 * Usage: npx tsx scripts/assignGenres.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const GENRES = [
    "Pop", "Rock", "K-Pop", "Hip Hop", "Electronic", "Jazz",
    "Classical", "R&B", "Country", "Latin", "Indie", "Metal", "Folk"
];

// Artist-to-genre mapping for known iTunes artists
const ARTIST_GENRE_MAP: Record<string, string> = {
    // Pop
    "Taylor Swift": "Pop", "Ariana Grande": "Pop", "Billie Eilish": "Pop",
    "Dua Lipa": "Pop", "The Weeknd": "Pop", "Ed Sheeran": "Pop",
    "Harry Styles": "Pop", "Olivia Rodrigo": "Pop", "Adele": "Pop",
    "Justin Bieber": "Pop", "Selena Gomez": "Pop", "Katy Perry": "Pop",
    "Lady Gaga": "Pop", "Bruno Mars": "Pop", "Post Malone": "Pop",
    "Shawn Mendes": "Pop", "Camila Cabello": "Pop", "Doja Cat": "Pop",
    "Beyoncé": "Pop", "Miley Cyrus": "Pop", "Rihanna": "Pop",
    "SZA": "R&B", "The Chainsmokers": "Electronic",
    "Lana Del Rey": "Indie", "Tame Impala": "Indie",

    // Rock
    "Imagine Dragons": "Rock", "Twenty One Pilots": "Rock",
    "Arctic Monkeys": "Rock", "Foo Fighters": "Rock", "Green Day": "Rock",
    "Linkin Park": "Rock", "Coldplay": "Rock", "U2": "Rock",
    "Queen": "Rock", "The Beatles": "Rock", "Nirvana": "Rock",
    "Red Hot Chili Peppers": "Rock", "Radiohead": "Rock",
    "Muse": "Rock", "Pearl Jam": "Rock", "Weezer": "Rock",

    // Hip Hop
    "Drake": "Hip Hop", "Kendrick Lamar": "Hip Hop", "Travis Scott": "Hip Hop",
    "J. Cole": "Hip Hop", "Kanye West": "Hip Hop", "Lil Nas X": "Hip Hop",
    "Eminem": "Hip Hop", "Jay-Z": "Hip Hop", "Nicki Minaj": "Hip Hop",
    "Cardi B": "Hip Hop", "Megan Thee Stallion": "Hip Hop",
    "Future": "Hip Hop", "21 Savage": "Hip Hop", "Lil Baby": "Hip Hop",

    // K-Pop
    "BTS": "K-Pop", "BLACKPINK": "K-Pop", "TWICE": "K-Pop",
    "Stray Kids": "K-Pop", "NewJeans": "K-Pop", "aespa": "K-Pop",
    "SEVENTEEN": "K-Pop", "EXO": "K-Pop", "Red Velvet": "K-Pop",
    "IU": "K-Pop", "LE SSERAFIM": "K-Pop", "(G)I-DLE": "K-Pop",

    // Electronic
    "Marshmello": "Electronic", "Calvin Harris": "Electronic",
    "David Guetta": "Electronic", "Skrillex": "Electronic",
    "Deadmau5": "Electronic", "Avicii": "Electronic",
    "Kygo": "Electronic", "Zedd": "Electronic", "Diplo": "Electronic",
    "Martin Garrix": "Electronic", "Alan Walker": "Electronic",

    // Jazz
    "Miles Davis": "Jazz", "John Coltrane": "Jazz",
    "Norah Jones": "Jazz", "Louis Armstrong": "Jazz",
    "Ella Fitzgerald": "Jazz", "Duke Ellington": "Jazz",

    // Classical
    "Ludovico Einaudi": "Classical", "Yo-Yo Ma": "Classical",
    "Hans Zimmer": "Classical", "Johann Sebastian Bach": "Classical",

    // R&B
    "Frank Ocean": "R&B", "Daniel Caesar": "R&B", "H.E.R.": "R&B",
    "Khalid": "R&B", "The Weeknd": "R&B", "Usher": "R&B",

    // Country
    "Luke Combs": "Country", "Morgan Wallen": "Country",
    "Zach Bryan": "Country", "Chris Stapleton": "Country",
    "Carrie Underwood": "Country", "Tim McGraw": "Country",

    // Latin
    "Bad Bunny": "Latin", "Shakira": "Latin", "J Balvin": "Latin",
    "Daddy Yankee": "Latin", "Rosalía": "Latin", "Ozuna": "Latin",

    // Metal
    "Metallica": "Metal", "Iron Maiden": "Metal", "Slipknot": "Metal",
    "Avenged Sevenfold": "Metal", "System of a Down": "Metal",

    // Folk
    "Mumford & Sons": "Folk", "The Lumineers": "Folk",
    "Bon Iver": "Folk", "Fleet Foxes": "Folk",
};

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI not set");
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const Song = mongoose.connection.collection("songs");

    // Get all songs without a genre (or genre is null)
    const songsWithoutGenre = await Song.find({
        $or: [{ genre: null }, { genre: { $exists: false } }, { genre: "" }],
    }).toArray();

    console.log(`Found ${songsWithoutGenre.length} songs without genre`);

    let assigned = 0;
    let randomAssigned = 0;

    for (const song of songsWithoutGenre) {
        let genre = ARTIST_GENRE_MAP[song.artist];

        if (!genre) {
            // Try case-insensitive partial match
            const artistLower = (song.artist || "").toLowerCase();
            for (const [mappedArtist, mappedGenre] of Object.entries(ARTIST_GENRE_MAP)) {
                if (artistLower.includes(mappedArtist.toLowerCase()) || mappedArtist.toLowerCase().includes(artistLower)) {
                    genre = mappedGenre;
                    break;
                }
            }
        }

        if (!genre) {
            // Assign a random genre for songs we can't identify
            genre = GENRES[randomAssigned % GENRES.length];
            randomAssigned++;
        }

        await Song.updateOne(
            { _id: song._id },
            { $set: { genre } }
        );
        assigned++;
    }

    console.log(`✅ Assigned genres to ${assigned} songs (${assigned - randomAssigned} by artist, ${randomAssigned} randomly distributed)`);

    // Print genre distribution
    const pipeline = [
        { $group: { _id: "$genre", count: { $sum: 1 } } },
        { $sort: { count: -1 as const } },
    ];
    const distribution = await Song.aggregate(pipeline).toArray();
    console.log("\nGenre distribution:");
    for (const item of distribution) {
        console.log(`  ${item._id || "null"}: ${item.count}`);
    }

    await mongoose.disconnect();
    console.log("\nDone!");
}

main().catch(console.error);
