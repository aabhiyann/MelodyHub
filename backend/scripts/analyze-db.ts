
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.model.js';
import { Song } from '../src/models/song.model.js';
import { Album } from '../src/models/album.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/melodyhub';

async function analyzeDatabase() {
    console.log('🔍 Starting Database Analysis...\n');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const models = [
            { name: 'User', model: User },
            { name: 'Song', model: Song },
            { name: 'Album', model: Album }
        ];

        for (const { name, model } of models) {
            console.log(`📊 analyzing Collection: ${name}s`);

            // 1. Count
            const count = await model.countDocuments();
            console.log(`   - Documents: ${count}`);

            // 2. Indexes
            const indexes = await model.collection.indexes();
            console.log(`   - Indexes:`);
            indexes.forEach(idx => {
                console.log(`     • ${idx.name}: ${JSON.stringify(idx.key)}`);
            });

            // 3. Size (if stats available - might need admin prevs depending on setup, but reliable in local)
            try {
                // @ts-ignore - stats() valid on collection
                const stats = await model.collection.stats();
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`   - Size: ${sizeMB} MB`);
            } catch (e) {
                console.log(`   - Size: (Unavailable)`);
            }

            console.log('');
        }

        // 4. Critical Query Analysis (Explain Plans)
        console.log('⚡ Analyzing Critical Queries:\n');

        // User by ClerkId (Auth loop)
        console.log('1. Find User by ClerkId (Auth)');
        const userExplain = await User.find({ clerkId: 'test_user_id' }).explain('executionStats');
        logExplain(userExplain);

        // Songs by Artist (Browse)
        console.log('2. Find Songs by Artist');
        const songExplain = await Song.find({ artist: 'Test Artist' }).explain('executionStats');
        logExplain(songExplain);

        // Recent Albums (Home)
        console.log('3. Find Recent Albums (Sort by createdAt)');
        const albumExplain = await Album.find().sort({ createdAt: -1 }).limit(10).explain('executionStats');
        logExplain(albumExplain);


    } catch (error) {
        console.error('❌ Analysis Failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🏁 Analysis Complete');
    }
}

function logExplain(explainResult: any) {
    const stats = explainResult.executionStats;
    const plan = explainResult.queryPlanner?.winningPlan;

    console.log(`   - Execution Time: ${stats.executionTimeMillis}ms`);
    console.log(`   - Documents Examined: ${stats.totalDocsExamined}`);
    console.log(`   - Documents Returned: ${stats.nReturned}`);
    console.log(`   - Index Used: ${plan?.inputStage?.indexName || 'NONE (COLLSCAN)'}`);

    if (stats.totalDocsExamined > stats.nReturned + 10 && stats.nReturned > 0) {
        console.log(`   ⚠️  INEFFICIENT QUERY: Scanned ${stats.totalDocsExamined} to return ${stats.nReturned}`);
    } else if (stats.totalDocsExamined > 1000 && !plan?.inputStage?.indexName) {
        console.log(`   ⚠️  MISSING INDEX: Scanned ${stats.totalDocsExamined} docs without index`);
    } else {
        console.log(`   ✅ Query looks optimized`);
    }
    console.log('');
}

analyzeDatabase();
