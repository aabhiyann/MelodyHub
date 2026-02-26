import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const playlists = await mongoose.connection.collection('sharedplaylists').find().toArray();
    console.log(JSON.stringify(playlists, null, 2));
    process.exit(0);
});
