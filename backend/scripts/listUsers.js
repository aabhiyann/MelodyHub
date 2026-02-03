#!/usr/bin/env node

/**
 * List All Users Script
 * 
 * Usage:
 *   node scripts/listUsers.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/melodyhub';

async function listUsers() {
    try {
        // Connect to database
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database\n');

        // Fetch all users
        const users = await User.find().select('fullName clerkId role createdAt').sort({ createdAt: -1 });

        if (users.length === 0) {
            console.log('ℹ️  No users found in database');
            process.exit(0);
        }

        console.log(`📋 Found ${users.length} user(s):\n`);
        console.log('┌─────────────────────────────┬─────────────────────────┬──────────┬─────────────┐');
        console.log('│ Name                        │ Clerk ID                │ Role     │ Created     │');
        console.log('├─────────────────────────────┼─────────────────────────┼──────────┼─────────────┤');

        users.forEach((user) => {
            const name = user.fullName.padEnd(27).substring(0, 27);
            const clerkId = user.clerkId.padEnd(23).substring(0, 23);
            const role = (user.role || 'user').padEnd(8);
            const created = user.createdAt.toLocaleDateString().padEnd(11);

            console.log(`│ ${name} │ ${clerkId} │ ${role} │ ${created} │`);
        });

        console.log('└─────────────────────────────┴─────────────────────────┴──────────┴─────────────┘');
        console.log(`\n📊 Summary:`);
        console.log(`   Total: ${users.length}`);
        console.log(`   Admins: ${users.filter(u => u.role === 'admin').length}`);
        console.log(`   Regular users: ${users.filter(u => u.role !== 'admin').length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

listUsers();
