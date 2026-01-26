import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { request, connect, close, clear } from './setup.js';
import { Song } from '../models/song.model.js';
import { UserPreference } from '../models/userPreference.model.js';

describe('Discovery Integration Tests', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await close();
    });

    beforeEach(async () => {
        await clear();
    });

    describe('GET /api/discovery/daily-mix', () => {
        it('should return 401 if unauthenticated', async () => {
            const res = await request.get('/api/discovery/daily-mix');
            expect(res.status).toBe(401);
        });

        it('should return daily mix songs for authenticated user', async () => {
            const userId = 'test_user_123';

            // Seed a song
            const song = await Song.create({
                title: 'Test Song',
                artist: 'Test Artist',
                audioUrl: 'http://example.com/audio.mp3',
                imageUrl: 'http://example.com/image.jpg',
                duration: 200,
                genre: 'Rock'
            });

            // Seed user preference
            await UserPreference.create({
                userId,
                favoriteGenres: [{ genre: 'Rock', weight: 1.0 }],
                likedSongs: [song._id],
                listeningHistory: []
            });

            const res = await request
                .get('/api/discovery/daily-mix')
                .set('x-test-user-id', userId);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            // Since we only have 1 song and logic mixes familiar + discovery, it should return at least something or empty depending on logic.
            // Our logic checks liked songs (familiar) and other songs (discovery).
            // We have 1 liked song, so familiarSongs result will have it.
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/discovery/trending', () => {
        it('should return trending songs', async () => {
            // Seed trending song
            await Song.create({
                title: 'Trending Song',
                artist: 'Star',
                audioUrl: 'http://example.com/trend.mp3',
                imageUrl: 'http://example.com/trend.jpg',
                duration: 180,
                isTrending: true,
                playCount: 1000
            });

            const res = await request.get('/api/discovery/trending');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].title).toBe('Trending Song');
        });
    });

    describe('GET /api/discovery/featured', () => {
        it('should return featured songs', async () => {
            await Song.create({
                title: 'Featured Song',
                artist: 'VIP',
                audioUrl: 'http://example.com/feat.mp3',
                imageUrl: 'http://example.com/feat.jpg',
                duration: 180,
                isFeatured: true
            });

            const res = await request.get('/api/discovery/featured');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].title).toBe('Featured Song');
        });
    });

    describe('GET /api/discovery/radio/:songId', () => {
        it('should return similar songs for radio', async () => {
            const seedSong = await Song.create({
                title: 'Seed Song',
                artist: 'Seed Artist',
                audioUrl: 'http://test.com/1.mp3',
                imageUrl: 'http://test.com/1.jpg',
                duration: 200,
                genre: 'Pop',
                features: { tempo: 120, energy: 0.8 }
            });

            const similarSong = await Song.create({
                title: 'Similar Song',
                artist: 'Other Artist',
                audioUrl: 'http://test.com/2.mp3',
                imageUrl: 'http://test.com/2.jpg',
                duration: 200,
                genre: 'Pop',
                features: { tempo: 125, energy: 0.7 }
            });

            const res = await request.get(`/api/discovery/radio/${seedSong._id}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.seedSongId).toBe((seedSong as any)._id.toString());
        });
    });
});
