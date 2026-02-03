#!/usr/bin/env tsx

/**
 * Make User Admin Script
 * 
 * Usage:
 *   npx tsx scripts/makeAdmin.ts <clerkId>
 *   npx tsx scripts/makeAdmin.ts <email>
 * 
 * Examples:
 *   npx tsx scripts/makeAdmin.ts user_2abc123def456
 *   npx tsx scripts/makeAdmin.ts admin@example.com
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/melodyhub';

async function makeAdmin(identifier: string) {
    try {
        // Connect to database
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database\n');

        // Find user by clerkId or email
        let user;

        // Check if it looks like a Clerk ID (starts with user_)
        if (identifier.startsWith('user_')) {
            console.log(`🔍 Searching for user with clerkId: ${identifier}`);
            user = await User.findOne({ clerkId: identifier });
        } else {
            console.log(`🔍 Searching for user with email-like identifier: ${identifier}`);
            // For email-based search, we'd need to add email field to User model
            // For now, just search by clerkId
            user = await User.findOne({ clerkId: identifier });

            if (!user) {
                console.log('ℹ️  Email search not yet implemented. Trying as clerkId...');
                user = await User.findOne({ clerkId: identifier });
            }
        }

        if (!user) {
            console.error(`❌ User not found: ${identifier}`);
            console.log('\n💡 Tips:');
            console.log('  - Make sure the user has signed up at least once');
            console.log('  - Check that the clerkId is correct');
            console.log('  - You can find clerkIds in the Clerk dashboard');
            process.exit(1);
        }

        // Check if already admin
        if (user.role === 'admin') {
            console.log(`ℹ️  User "${user.fullName}" is already an admin\n`);
            console.log('👤 User Details:');
            console.log(`   Name: ${user.fullName}`);
            console.log(`   Clerk ID: ${user.clerkId}`);
            console.log(`   Role: ${user.role}`);
            process.exit(0);
        }

        // Update user to admin
        user.role = 'admin';
        await user.save();

        console.log('✅ Successfully promoted user to admin!\n');
        console.log('👤 User Details:');
        console.log(`   Name: ${user.fullName}`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Image: ${user.imageUrl}`);
        console.log('\n🎉 Done! The user now has admin access.');

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error:', message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node scripts/makeAdmin.js <clerkId>');
    console.log('Example: node scripts/makeAdmin.js user_2abc123def456');
    process.exit(1);
}

const identifier = args[0];
makeAdmin(identifier);
