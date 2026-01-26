import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../index.js'; // Assuming app is exported from index.ts
import supertest from 'supertest';

let mongoServer: MongoMemoryServer;

// Connect to in-memory db before tests
export const connect = async () => {
    // Only create if not already created
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
    }
    const uri = mongoServer.getUri();

    // Disconnect if already connected (avoid overwrite error)
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
};

// Close db connection after tests
export const close = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

// Clear db between tests
export const clear = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

export const request = supertest(app);
