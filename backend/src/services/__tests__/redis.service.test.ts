/**
 * Unit tests for Redis service
 * Tests get, set, del, getStats when client is not connected (no Redis required)
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { redisService } from '../redis.service.js';

describe('RedisService', () => {
  beforeEach(async () => {
    await redisService.disconnect();
  });

  it('get returns null when not connected', async () => {
    const result = await redisService.get<string>('anykey');
    expect(result).toBeNull();
  });

  it('set does not throw when not connected', async () => {
    await expect(redisService.set('key', { foo: 'bar' })).resolves.not.toThrow();
  });

  it('set with ttl does not throw when not connected', async () => {
    await expect(redisService.set('key', 'value', 3600)).resolves.not.toThrow();
  });

  it('del does not throw when not connected', async () => {
    await expect(redisService.del('key')).resolves.not.toThrow();
  });

  it('del with array does not throw when not connected', async () => {
    await expect(redisService.del(['key1', 'key2'])).resolves.not.toThrow();
  });

  it('delPattern does not throw when not connected', async () => {
    await expect(redisService.delPattern('prefix:*')).resolves.not.toThrow();
  });

  it('exists returns false when not connected', async () => {
    const result = await redisService.exists('key');
    expect(result).toBe(false);
  });

  it('expire does not throw when not connected', async () => {
    await expect(redisService.expire('key', 60)).resolves.not.toThrow();
  });

  it('ttl returns -1 when not connected', async () => {
    const result = await redisService.ttl('key');
    expect(result).toBe(-1);
  });

  it('getStats returns connected false when not connected', async () => {
    const stats = await redisService.getStats();
    expect(stats.connected).toBe(false);
    expect(stats.keyCount).toBe(0);
    expect(stats.memoryUsed).toBe('0 MB');
  });
});
