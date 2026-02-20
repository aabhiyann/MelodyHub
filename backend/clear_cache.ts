import { redisService } from './src/services/redis.service.js';
import dotenv from 'dotenv';
dotenv.config();

async function clearCache() {
    console.log("Connecting to Redis...");
    await redisService.connect();
    console.log("Deleting users:all cache...");
    await redisService.del('users:all');
    console.log("Deleted. Now disconnecting...");
    await redisService.disconnect();
    console.log("Done.");
}

clearCache().catch(console.error);
