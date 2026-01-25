
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const createFake = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        // Check if fake user exists
        const existing = await User.findOne({ clerkId: 'fake_user_123' });
        if (existing) {
            console.log('Fake user already exists.');
            return;
        }

        const fakeUser = await User.create({
            clerkId: 'fake_user_123',
            fullName: 'Melody Bot',
            imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Melody',
        });

        console.log('Created fake user:', fakeUser.fullName);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createFake();
