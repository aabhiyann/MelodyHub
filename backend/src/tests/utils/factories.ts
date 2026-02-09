import mongoose from 'mongoose';
import { User } from '../../models/user.model.js';
import { Song } from '../../models/song.model.js';
import { Album } from '../../models/album.model.js';
// import { Playlist } from '../../models/playlist.model.js'; // TODO: Add when playlist model exists

/**
 * Factory functions to create test data
 */

export const createTestUser = async (overrides = {}) => {
    const defaults = {
        clerkId: `test_clerk_${Date.now()}_${Math.random()}`,
        fullName: 'Test User',
        imageUrl: 'https://example.com/image.jpg',
        followers: [],
        following: [],
        gamification: {
            level: 1,
            xp: 0,
            streak: 0,
            streakFreezes: 0,
            lastListenDate: new Date(),
        },
    };

    const user = await User.create({ ...defaults, ...overrides });
    return user;
};

export const createTestSong = async (overrides = {}) => {
    const defaults = {
        title: 'Test Song',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/song.jpg',
        audioUrl: 'https://example.com/song.mp3',
        duration: '180',
        genre: 'Pop', // String, not array
        year: 2024,
        playCount: 0,
        likeCount: 0,
    };

    const song = await Song.create({ ...defaults, ...overrides });
    return song;
};

export const createTestAlbum = async (overrides = {}) => {
    const defaults = {
        title: 'Test Album',
        artist: 'Test Artist',
        imageUrl: 'https://example.com/album.jpg',
        releaseYear: 2024,
        songs: [],
    };

    const album = await Album.create({ ...defaults, ...overrides });
    return album;
};

// export const createTestPlaylist = async (userId: string | mongoose.Types.ObjectId, overrides = {}) => {
//     const defaults = {
//         name: 'Test Playlist',
//         userId,
//         songs: [],
//         isPublic: true,
//         collaborative: false,
//     };

//     const playlist = await Playlist.create({ ...defaults, ...overrides });
//     return playlist;
// };

/**
 * Create multiple test entities
 */
export const createTestSongs = async (count: number, overrides = {}) => {
    const songs = [];
    for (let i = 0; i < count; i++) {
        const song = await createTestSong({
            ...overrides,
            title: `Test Song ${i + 1}`,
        });
        songs.push(song);
    }
    return songs;
};

export const createTestUsers = async (count: number, overrides = {}) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const user = await createTestUser({
            fullName: `Test User ${i + 1}`,
            ...overrides,
        });
        users.push(user);
    }
    return users;
};
