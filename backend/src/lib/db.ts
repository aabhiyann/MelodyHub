import mongoose from 'mongoose';
import { redisService } from '../services/redis.service.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error: ' + (error instanceof Error ? error.message : "Unknown error"));
    // Throw error instead of process.exit so tests can handle it
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

/**
 * Initialize Redis connection (optional - app works without it).
 * Call after connectDB() when REDIS_URL is set or in production.
 */
export const connectRedis = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production' || process.env.REDIS_URL) {
    await redisService.connect();
  } else {
    console.log('ℹ️  Redis disabled in development (set REDIS_URL to enable)');
  }
};
