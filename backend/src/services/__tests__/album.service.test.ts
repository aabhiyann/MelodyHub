import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AlbumService } from '../album.service';
import { Album } from '../../models/album.model';
import { Song } from '../../models/song.model';
import mongoose from 'mongoose';

// Mock Redis Service
jest.mock('../redis.service', () => ({
    redisService: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

describe('AlbumService', () => {
    let albumService: AlbumService;

    beforeEach(() => {
        albumService = new AlbumService();
        jest.clearAllMocks();
    });

    const seedAlbums = async (count: number) => {
        const albums = [];
        for (let i = 0; i < count; i++) {
            albums.push({
                title: `Album ${i}`,
                artist: `Artist ${i}`,
                imageUrl: `img${i}.jpg`,
                releaseYear: 2023,
            });
        }
        await Album.insertMany(albums);
    };

    describe('getAllAlbums', () => {
        it('should return paginated albums', async () => {
            await seedAlbums(25);

            const result = await albumService.getAllAlbums(1, 10);

            expect(result.data).toHaveLength(10);
            expect(result.pagination.total).toBe(25);
            expect(result.pagination.totalPages).toBe(3);
        });
    });

    describe('getAlbumById', () => {
        it('should return album with populated songs', async () => {
            // Create songs
            const song1 = await Song.create({ title: 'Song 1', artist: 'Artist 1', audioUrl: 'url1', duration: 180, imageUrl: 'img1' });
            const song2 = await Song.create({ title: 'Song 2', artist: 'Artist 1', audioUrl: 'url2', duration: 180, imageUrl: 'img2' });

            // Create album with songs
            const album = await Album.create({
                title: 'Test Album',
                artist: 'Artist 1',
                imageUrl: 'album.jpg',
                releaseYear: 2023,
                songs: [song1._id, song2._id]
            });

            const result = await albumService.getAlbumById((album as any)._id.toString());

            expect(result).toBeDefined();
            expect(result.title).toBe('Test Album');
            expect(result.songs).toHaveLength(2);
            // Verify population
            expect((result.songs[0] as any).title).toBe('Song 1');
        });

        it('should throw if album not found', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await expect(albumService.getAlbumById(fakeId)).rejects.toThrow('Album not found');
        });
    });
});
