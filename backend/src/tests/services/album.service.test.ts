import { AlbumService } from '../../services/album.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestAlbum, createTestSong } from '../utils/factories.js';

describe('AlbumService', () => {
    let albumService: AlbumService;
    let originalGet: any;
    let originalSet: any;

    beforeAll(async () => {
        await connect();

        // Mock Redis
        const { redisService } = await import('../../services/redis.service.js');
        originalGet = redisService.get;
        originalSet = redisService.set;
        redisService.get = async () => null;
        redisService.set = async () => undefined as any;

        albumService = new AlbumService();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        const { redisService } = await import('../../services/redis.service.js');
        redisService.get = originalGet;
        redisService.set = originalSet;
        await closeDatabase();
    });

    describe('getAllAlbums', () => {
        it('should return paginated albums', async () => {
            // Create test albums
            for (let i = 0; i < 15; i++) {
                await createTestAlbum({ title: `Album ${i + 1}` });
            }

            const result = await albumService.getAllAlbums(1, 10);

            expect(result.data).toHaveLength(10);
            expect(result.pagination.total).toBe(15);
            expect(result.pagination.totalPages).toBe(2);
            expect(result.pagination.hasNextPage).toBe(true);
            expect(result.pagination.hasPrevPage).toBe(false);
        });

        it('should return second page correctly', async () => {
            for (let i = 0; i < 15; i++) {
                await createTestAlbum({ title: `Album ${i + 1}` });
            }

            const result = await albumService.getAllAlbums(2, 10);

            expect(result.data).toHaveLength(5);
            expect(result.pagination.page).toBe(2);
            expect(result.pagination.hasNextPage).toBe(false);
            expect(result.pagination.hasPrevPage).toBe(true);
        });

        it('should handle empty database', async () => {
            const result = await albumService.getAllAlbums(1, 10);

            expect(result.data).toHaveLength(0);
            expect(result.pagination.total).toBe(0);
        });
    });

    describe('getAlbumById', () => {
        it('should return album with populated songs', async () => {
            const song1 = await createTestSong({ title: 'Song 1' });
            const song2 = await createTestSong({ title: 'Song 2' });

            const album = await createTestAlbum({
                title: 'Test Album',
                songs: [song1._id, song2._id],
            });

            const result = await albumService.getAlbumById(String(album._id || ''));

            expect(result).toBeDefined();
            expect(result.title).toBe('Test Album');
            expect(result.songs).toHaveLength(2);
        });

        it('should throw error if album not found', async () => {
            await expect(
                albumService.getAlbumById('000000000000000000000000')
            ).rejects.toThrow('Album not found');
        });
    });
});
