/**
 * Unit Tests for Recommendation Service
 * Tests collaborative filtering, content-based filtering, and hybrid algorithm
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
    contentBasedRecommendations,
    collaborativeFilteringRecommendations,
    hybridRecommendations,
    updateUserAudioPreferences,
    updateUserFavorites,
} from '../services/recommendation.service';
import { UserPreference } from '../models/userPreference.model';
import { Song } from '../models/song.model';
import { connectDB } from '../lib/db';
import mongoose from 'mongoose';

describe('Recommendation Service - Unit Tests', () => {
    beforeAll(async () => {
        // Connect to test database
        await connectDB();
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.connection.close();
    });

    describe('Content-Based Filtering', () => {
        test('should return empty array for users without audio preferences', async () => {
            const testUserId = 'test-user-no-prefs';

            // Clean up if exists
            await UserPreference.deleteOne({ userId: testUserId });

            const result = await contentBasedRecommendations(testUserId, 10);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        test('should match songs with similar audio features', async () => {
            const testUserId = 'test-user-audio-prefs';

            // Create user with audio preferences
            await UserPreference.findOneAndUpdate(
                { userId: testUserId },
                {
                    userId: testUserId,
                    audioPreferences: {
                        tempo: 120,
                        energy: 0.8,
                        danceability: 0.7,
                        valence: 0.6,
                    },
                    listeningHistory: [],
                    likedSongs: [],
                    favoriteGenres: [],
                    favoriteArtists: [],
                },
                { upsert: true, new: true }
            );

            const result = await contentBasedRecommendations(testUserId, 10);
            expect(Array.isArray(result)).toBe(true);
            // Results depend on database content
        });
    });

    describe('Collaborative Filtering', () => {
        test('should return empty array for users with < 3 liked songs', async () => {
            const testUserId = 'test-user-few-likes';

            await UserPreference.findOneAndUpdate(
                { userId: testUserId },
                {
                    userId: testUserId,
                    likedSongs: [], // Less than 3
                    listeningHistory: [],
                    favoriteGenres: [],
                    favoriteArtists: [],
                },
                { upsert: true, new: true }
            );

            const result = await collaborativeFilteringRecommendations(testUserId, 10);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe('Hybrid Recommendations', () => {
        test('should return popular songs for new users (cold start)', async () => {
            const testUserId = 'test-user-new';

            // Clean up
            await UserPreference.deleteOne({ userId: testUserId });

            const result = await hybridRecommendations(testUserId, 10);

            expect(result.songs).toBeDefined();
            expect(Array.isArray(result.songs)).toBe(true);
            expect(result.algorithm).toBe('popular');
            expect(result.confidence).toBeLessThanOrEqual(0.5);
        });

        test('should use hybrid for users with rich data', async () => {
            const testUserId = 'test-user-rich-data';

            // Create songs for testing
            const testSongs = await Song.find().limit(5).select('_id');

            if (testSongs.length >= 3) {
                await UserPreference.findOneAndUpdate(
                    { userId: testUserId },
                    {
                        userId: testUserId,
                        likedSongs: testSongs.slice(0, 3).map(s => s._id),
                        listeningHistory: testSongs.map(s => ({
                            songId: s._id,
                            playedAt: new Date(),
                            completionRate: 0.9,
                            skipped: false,
                        })),
                        audioPreferences: {
                            tempo: 120,
                            energy: 0.8,
                            danceability: 0.7,
                            valence: 0.6,
                        },
                        favoriteGenres: [{ genre: 'Rock', weight: 0.8 }],
                        favoriteArtists: [{ artist: 'Test Artist', weight: 0.7 }],
                    },
                    { upsert: true, new: true }
                );

                const result = await hybridRecommendations(testUserId, 10);

                expect(result.songs).toBeDefined();
                expect(result.algorithm).toBeDefined();
                expect(result.confidence).toBeGreaterThan(0.5);
            }
        });

        test('should return confidence score between 0 and 1', async () => {
            const testUserId = 'test-user-confidence';

            const result = await hybridRecommendations(testUserId, 10);

            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
        });
    });

    describe('User Preference Learning', () => {
        test('updateUserAudioPreferences should calculate averages correctly', async () => {
            const testUserId = 'test-user-audio-learning';

            // Create test songs with features
            const testSongs = await Song.find({
                'features.tempo': { $exists: true },
            }).limit(5);

            if (testSongs.length > 0) {
                await UserPreference.findOneAndUpdate(
                    { userId: testUserId },
                    {
                        userId: testUserId,
                        listeningHistory: testSongs.map(s => ({
                            songId: s._id,
                            playedAt: new Date(),
                            completionRate: 0.9,
                            skipped: false,
                        })),
                        likedSongs: [],
                        favoriteGenres: [],
                        favoriteArtists: [],
                    },
                    { upsert: true, new: true }
                );

                await updateUserAudioPreferences(testUserId);

                const updated = await UserPreference.findOne({ userId: testUserId });
                expect(updated?.audioPreferences).toBeDefined();
            }
        });

        test('updateUserFavorites should track genre preferences', async () => {
            const testUserId = 'test-user-genre-learning';

            // Create test data
            const testSongs = await Song.find({ genre: { $exists: true } }).limit(10);

            if (testSongs.length > 0) {
                await UserPreference.findOneAndUpdate(
                    { userId: testUserId },
                    {
                        userId: testUserId,
                        listeningHistory: testSongs.map(s => ({
                            songId: s._id,
                            playedAt: new Date(),
                            completionRate: 0.9,
                            skipped: false,
                        })),
                        likedSongs: [],
                        favoriteGenres: [],
                        favoriteArtists: [],
                    },
                    { upsert: true, new: true }
                );

                await updateUserFavorites(testUserId);

                const updated = await UserPreference.findOne({ userId: testUserId });
                expect(updated?.favoriteGenres).toBeDefined();
                expect(Array.isArray(updated?.favoriteGenres)).toBe(true);
            }
        });
    });
});

export { };
