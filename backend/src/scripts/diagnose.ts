
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user.model.js';
import { Song } from '../models/song.model.js';
import { SharedPlaylist } from '../models/sharedPlaylist.model.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const diagnose = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URI:', process.env.MONGODB_URI?.substring(0, 20) + '...');

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected!');

        // 1. Check Users
        const users = await User.find({});
        console.log(`\n--- USERS (${users.length}) ---`);
        if (users.length === 0) {
            console.log('❌ NO USERS FOUND. Auth Sync is completely broken.');
        } else {
            users.forEach(u => console.log(`- ${u.fullName} (${u.clerkId}) [${u._id}]`));
        }

        // 2. Check Songs
        const songs = await Song.countDocuments();
        console.log(`\n--- SONGS: ${songs} ---`);

        // 3. Check Playlists
        const playlists = await SharedPlaylist.find({});
        console.log(`\n--- PLAYLISTS (${playlists.length}) ---`);
        playlists.forEach(p => console.log(`- ${p.name} (Owner: ${p.owner})`));

    } catch (error) {
        console.error('Diagnosis Failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

diagnose();
