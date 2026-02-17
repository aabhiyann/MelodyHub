import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SongService } from '../song.service';
import { Song } from '../../models/song.model';

// Mock Redis Service
jest.mock('../redis.service', () => ({
    redisService: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

describe('SongService', () => {
    let songService: SongService;

    beforeEach(() => {
        songService = new SongService();
        jest.clearAllMocks();
    });

    // Helper to seed songs
    const seedSongs = async (count: number) => {
        const songs = [];
        for (let i = 0; i < count; i++) {
            songs.push({
                title: `Song ${i}`,
                artist: `Artist ${i}`,
                imageUrl: `img${i}.jpg`,
                audioUrl: `audio${i}.mp3`,
                duration: 180,
                albumId: null,
            });
        }
        await Song.insertMany(songs);
    };

    describe('getAllSongs', () => {
        it('should return paginated songs', async () => {
            await seedSongs(25);

            const result = await songService.getAllSongs(1, 10);

            expect(result.data).toHaveLength(10);
            expect(result.pagination.total).toBe(25);
            expect(result.pagination.totalPages).toBe(3);
            expect(result.pagination.hasNextPage).toBe(true);
        });

        it('should return correct page', async () => {
            await seedSongs(25);

            const result = await songService.getAllSongs(3, 10);

            expect(result.data).toHaveLength(5); // Last page
            expect(result.pagination.page).toBe(3);
            expect(result.pagination.hasNextPage).toBe(false);
        });
    });

    describe('getFeaturedSongs', () => {
        it('should return songs from DB when cache miss', async () => {
            await seedSongs(10);

            const songs = await songService.getFeaturedSongs();

            expect(songs).toBeDefined();
            expect(songs.length).toBeGreaterThan(0);
            // $sample size is 6, but we inserted 10, so expect <= 6
            expect(songs.length).toBeLessThanOrEqual(6);
        });
    });

    describe('getTrendingSongs', () => {
        it('should return latest songs', async () => {
            // Seed with specific timestamps? 
            // insertMany creates them roughly at same time, but we can rely on default sort
            await seedSongs(5);

            const songs = await songService.getTrendingSongs();

            expect(songs).toHaveLength(4); // Limit is 4
        });
    });
});
