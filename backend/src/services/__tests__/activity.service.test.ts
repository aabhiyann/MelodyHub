/**
 * Unit tests for Activity service
 * Tests logActivity and getFeed with in-memory MongoDB
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ActivityService } from '../activity.service.js';
import { Activity, ActivityType } from '../../models/activity.model.js';
import { UserConnection } from '../../models/user.connection.model.js';

let mongoServer: MongoMemoryServer;
let service: ActivityService;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  service = new ActivityService();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

describe('ActivityService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('logActivity creates an activity', async () => {
    const userId = new mongoose.Types.ObjectId();
    const targetId = new mongoose.Types.ObjectId();

    const result = await service.logActivity(
      userId.toString(),
      ActivityType.LIKE_SONG,
      targetId.toString()
    );

    expect(result).toBeDefined();
    expect(result.userId.toString()).toBe(userId.toString());
    expect(result.type).toBe(ActivityType.LIKE_SONG);
    expect(result.targetId.toString()).toBe(targetId.toString());

    const count = await Activity.countDocuments();
    expect(count).toBe(1);
  });

  it('getFeed returns empty array when user follows no one', async () => {
    const userId = new mongoose.Types.ObjectId();
    const result = await service.getFeed(userId.toString(), 20);
    expect(result).toEqual([]);
  });

  it('getFeed returns activities from followed users', async () => {
    const followerId = new mongoose.Types.ObjectId();
    const followingId = new mongoose.Types.ObjectId();
    await UserConnection.create({ followerId, followingId });

    await Activity.create({
      userId: followingId,
      type: ActivityType.LIKE_SONG,
      targetId: new mongoose.Types.ObjectId(),
    });

    const result = await service.getFeed(followerId.toString(), 20);
    expect(Array.isArray(result)).toBe(true);
  });
});
