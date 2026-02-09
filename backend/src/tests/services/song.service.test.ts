import { SongService } from '../../services/song.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestSongs } from '../utils/factories.js';

describe('SongService', () => {
  let songService: SongService;
  let originalGet: any;
  let originalSet: any;

  beforeAll(async () => {
    await connect();
    
    // Import and store original methods
    const { redisService } = await import('../../services/redis.service.js');
    originalGet = redisService.get;
    originalSet = redisService.set;
    
    // Replace with mocks - fix return type
    redisService.get = async () => null;
    redisService.set = async () => undefined as any;
    
    songService = new SongService();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    // Restore original methods
    const { redisService } = await import('../../services/redis.service.js');
    redisService.get = originalGet;
    redisService.set = originalSet;
    
    await closeDatabase();
  });

  describe('getAllSongs', () => {
    it('should return paginated songs', async () => {
      await createTestSongs(25);
      const result = await songService.getAllSongs(1, 10);

      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
    });

    it('should handle empty database', async () => {
      const result = await songService.getAllSongs(1, 10);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getFeaturedSongs', () => {
    it('should return random songs', async () => {
      await createTestSongs(10);
      const songs = await songService.getFeaturedSongs();

      expect(Array.isArray(songs)).toBe(true);
      expect(songs.length).toBeLessThanOrEqual(6);
    });
  });

  describe('getTrendingSongs', () => {
    it('should return most recent songs', async () => {
      await createTestSongs(10);
      const songs = await songService.getTrendingSongs();

      expect(Array.isArray(songs)).toBe(true);
      expect(songs.length).toBeLessThanOrEqual(4);
    });
  });
});
