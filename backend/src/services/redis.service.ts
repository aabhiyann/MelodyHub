import { createClient, RedisClientType } from 'redis';

class RedisService {
    private client: RedisClientType | null = null;
    private isConnected: boolean = false;

    async connect(): Promise<void> {
        try {
            // Create Redis client
            this.client = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            console.error('Max Redis reconnection attempts reached');
                            return new Error('Max reconnection attempts reached');
                        }
                        return retries * 100; // Exponential backoff
                    },
                },
            });

            // Error handling
            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('✅ Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                console.log('✅ Redis Client Ready');
            });

            this.client.on('end', () => {
                console.log('⚠️  Redis Client Disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            // Don't throw - allow app to work without Redis
            this.isConnected = false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
        }
    }

    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.client || !this.isConnected) return null;

        try {
            const data = await this.client.get(key);
            return (data && typeof data === 'string') ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Redis GET error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set value in cache with TTL
     */
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            const serialized = JSON.stringify(value);

            if (ttlSeconds) {
                await this.client.setEx(key, ttlSeconds, serialized);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (error) {
            console.error(`Redis SET error for key ${key}:`, error);
        }
    }

    /**
     * Delete value from cache
     */
    async del(key: string | string[]): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            if (Array.isArray(key)) {
                await this.client.del(key);
            } else {
                await this.client.del(key);
            }
        } catch (error) {
            console.error(`Redis DEL error for key ${key}:`, error);
        }
    }

    /**
     * Delete all keys matching pattern
     */
    async delPattern(pattern: string): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
        } catch (error) {
            console.error(`Redis DEL pattern error for ${pattern}:`, error);
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        if (!this.client || !this.isConnected) return false;

        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`Redis EXISTS error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Set expiration on existing key
     */
    async expire(key: string, ttlSeconds: number): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            await this.client.expire(key, ttlSeconds);
        } catch (error) {
            console.error(`Redis EXPIRE error for key ${key}:`, error);
        }
    }

    /**
     * Get time to live for key
     */
    async ttl(key: string): Promise<number> {
        if (!this.client || !this.isConnected) return -1;

        try {
            return await this.client.ttl(key);
        } catch (error) {
            console.error(`Redis TTL error for key ${key}:`, error);
            return -1;
        }
    }

    /**
     * Flush all cache
     */
    async flushAll(): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            await this.client.flushAll();
            console.log('✅ Redis cache flushed');
        } catch (error) {
            console.error('Redis FLUSHALL error:', error);
        }
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<{
        connected: boolean;
        keyCount: number;
        memoryUsed: string;
    }> {
        if (!this.client || !this.isConnected) {
            return { connected: false, keyCount: 0, memoryUsed: '0 MB' };
        }

        try {
            const info = await this.client.info('memory');
            const keys = await this.client.dbSize();

            // Parse memory used from info string
            const memoryMatch = info.match(/used_memory_human:(\S+)/);
            const memoryUsed = memoryMatch ? memoryMatch[1] : '0 MB';

            return {
                connected: true,
                keyCount: keys,
                memoryUsed,
            };
        } catch (error) {
            console.error('Redis STATS error:', error);
            return { connected: false, keyCount: 0, memoryUsed: '0 MB' };
        }
    }
}

// Export singleton instance
export const redisService = new RedisService();
