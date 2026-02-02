/**
 * Unit tests for Analytics service
 * Tests getUserDashboard and getListeningPatterns with in-memory MongoDB
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as analyticsService from '../analytics.service.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
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

describe('Analytics Service', () => {
  it('getUserDashboard returns default when no user preference', async () => {
    const result = await analyticsService.getUserDashboard('user-123', 'all');

    expect(result).toEqual({
      totalListeningTime: 0,
      totalPlays: 0,
      totalLikes: 0,
      topArtists: [],
      topSongs: [],
      topGenres: [],
      discoveryRate: 0,
      skipRate: 0,
    });
  });

  it('getListeningPatterns returns default when no user preference', async () => {
    const result = await analyticsService.getListeningPatterns('user-123');

    expect(result).toEqual({
      hourOfDay: [],
      dayOfWeek: [],
      mostActiveTime: 'No data',
    });
  });
});
