import { itunesService } from '../services/itunes.service.js';
import { Song } from '../models/song.model.js';
import { connectDB } from '../lib/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Population Script
 * Populates MongoDB with real music data from iTunes API
 */

async function populateDatabase() {
  console.log('🎵 Starting database population...\n');

  try {
    // Connect to database
    await connectDB();

    // Check existing songs
    const existingCount = await Song.countDocuments();
    console.log(`📊 Existing songs in database: ${existingCount}`);

    if (existingCount >= 100) {
      console.log('✅ Database already has sufficient songs. Skipping population.');
      console.log('   To re-populate, delete existing songs first.');
      process.exit(0);
    }

    // Fetch diverse tracks from iTunes
    console.log('\n🔍 Fetching tracks from iTunes API...');
    const tracks = await itunesService.getDiverseTracks(70); // 70 per genre = ~1050 songs

    console.log(`\n✅ Fetched ${tracks.length} tracks from iTunes`);

    // Remove duplicates
    const uniqueTracks = tracks.filter(
      (track, index, self) => index === self.findIndex((t) => t.trackId === track.trackId)
    );

    console.log(`📋 Unique tracks after deduplication: ${uniqueTracks.length}`);

    // Only keep tracks with a playable 30s preview URL so every song in the catalog is playable
    const playableTracks = uniqueTracks.filter(
      (track) => track.previewUrl && track.previewUrl.trim().length > 0
    );
    console.log(`🎧 Tracks with preview URL (playable): ${playableTracks.length}`);

    // Convert and save to MongoDB
    console.log('\n💾 Saving tracks to MongoDB...');
    let savedCount = 0;
    let skippedCount = 0;

    for (const track of uniqueTracks) {
      try {
        // Check if track already exists
        const exists = await Song.findOne({ title: track.trackName, artist: track.artistName });

        if (exists) {
          skippedCount++;
          continue;
        }

        // Generate audio features
        const audioFeatures = itunesService.generateAudioFeatures(track.primaryGenreName);

        // Create song document
        const song = new Song({
          title: track.trackName,
          artist: track.artistName,
          imageUrl: track.artworkUrl100.replace('100x100', '600x600'), // Higher resolution
          audioUrl: track.previewUrl!, // 30-second preview (we filtered to playable only)
          duration: Math.round(track.trackTimeMillis / 1000), // Convert to seconds
          genre: track.primaryGenreName,
          year: new Date(track.releaseDate).getFullYear(),
          explicit: false, // iTunes doesn't provide this easily
          features: {
            tempo: audioFeatures.tempo,
            energy: audioFeatures.energy,
            danceability: audioFeatures.danceability,
            valence: audioFeatures.valence,
            acousticness: audioFeatures.acousticness,
            instrumentalness: audioFeatures.instrumentalness,
            key: audioFeatures.key,
            loudness: audioFeatures.loudness,
            mode: audioFeatures.mode,
          },
          playCount: Math.floor(Math.random() * 10000), // Random initial play count
          likeCount: Math.floor(Math.random() * 1000),
          skipCount: Math.floor(Math.random() * 100),
          isFeatured: Math.random() > 0.9, // 10% featured
          isTrending: Math.random() > 0.95, // 5% trending
        });

        await song.save();
        savedCount++;

        // Progress indicator
        if (savedCount % 50 === 0) {
          console.log(`   Saved ${savedCount}/${playableTracks.length} songs...`);
        }
      } catch (error) {
        console.error(`   Error saving ${track.trackName}:`, (error instanceof Error ? error.message : "Unknown error"));
        skippedCount++;
      }
    }

    console.log(`\n✅ Database population complete!`);
    console.log(`   💾 Saved: ${savedCount} songs`);
    console.log(`   ⏭️  Skipped: ${skippedCount} songs`);
    console.log(`   📊 Total in database: ${await Song.countDocuments()}`);

    // Show genre breakdown
    console.log('\n📊 Genre Breakdown:');
    const genreStats = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    genreStats.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} songs`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error populating database:', error);
    process.exit(1);
  }
}

// Run the script
populateDatabase();
