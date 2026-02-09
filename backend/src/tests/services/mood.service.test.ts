import { getCurrentMood, getPlaylistForMood, MoodLabel } from '../../services/mood.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser, createTestSong } from '../utils/factories.js';
import { UserPreference } from '../../models/userPreference.model.js';

describe('MoodService', () => {
    beforeAll(async () => {
        await connect();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('getCurrentMood', () => {
        it('should return neutral mood for user with no listening history', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const result = await getCurrentMood(userId);

            expect(result.mood).toBe('neutral');
            expect(result.label).toBe('Neutral');
            expect(result.confidence).toBeLessThan(0.5);
            expect(result.reason).toContain('No listening history');
        });

        it('should detect mood from listening history', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            // Create songs with specific genres
            const song1 = await createTestSong({ genre: 'Pop', title: 'Happy Song 1' });
            const song2 = await createTestSong({ genre: 'Pop', title: 'Happy Song 2' });

            // Create user preference with listening history
            await UserPreference.create({
                userId,
                listeningHistory: [
                    { songId: song1._id, listenedAt: new Date() },
                    { songId: song2._id, listenedAt: new Date() },
                ],
            });

            const result = await getCurrentMood(userId);

            expect(result).toBeDefined();
            expect(result.mood).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0);
        });
    });

    describe('getPlaylistForMood', () => {
        it('should return songs matching mood genres', async () => {
            // Create songs with different genres
            await createTestSong({ genre: 'Pop', title: 'Pop Song' });
            await createTestSong({ genre: 'Rock', title: 'Rock Song' });
            await createTestSong({ genre: 'Jazz', title: 'Jazz Song' });

            const result = await getPlaylistForMood('happy', 20);

            expect(Array.isArray(result)).toBe(true);
            // Happy mood should include Pop songs
            expect(result.length).toBeGreaterThan(0);
        });

        it('should limit results to specified limit', async () => {
            for (let i = 0; i < 10; i++) {
                await createTestSong({ genre: 'Pop', title: `Song ${i}` });
            }

            const result = await getPlaylistForMood('happy', 5);

            expect(result.length).toBeLessThanOrEqual(5);
        });

        it('should handle all mood types', async () => {
            await createTestSong({ genre: 'Pop' });

            const moods: MoodLabel[] = ['happy', 'sad', 'energetic', 'chill', 'focused', 'romantic', 'neutral'];

            for (const mood of moods) {
                const result = await getPlaylistForMood(mood, 10);
                expect(Array.isArray(result)).toBe(true);
            }
        });
    });
});
