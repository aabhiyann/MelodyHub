import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PlaylistService } from '../playlist.service';
import { SharedPlaylist } from '../../models/sharedPlaylist.model';
import mongoose from 'mongoose';

describe('PlaylistService', () => {
    let playlistService: PlaylistService;

    beforeEach(() => {
        playlistService = new PlaylistService();
        jest.clearAllMocks();
    });

    describe('createPlaylist', () => {
        it('should create a new playlist', async () => {
            const userId = 'user_123';
            const data = { name: 'My Playlist', description: 'Test', isPublic: true };

            const playlist = await playlistService.createPlaylist(userId, data);

            expect(playlist).toBeDefined();
            expect(playlist.name).toBe(data.name);
            expect(playlist.owner).toBe(userId);
            expect(playlist.isPublic).toBe(true);

            // Verify DB persistence
            const dbPlaylist = await SharedPlaylist.findById(playlist._id);
            expect(dbPlaylist).toBeDefined();
        });
    });

    describe('getAllPlaylists', () => {
        it('should return playlists for user', async () => {
            const userId = 'user_123';
            await SharedPlaylist.create({ name: 'P1', owner: userId });
            await SharedPlaylist.create({ name: 'P2', owner: userId });
            await SharedPlaylist.create({ name: 'Other', owner: 'other_user' });

            const playlists = await playlistService.getAllPlaylists(userId);

            expect(playlists).toHaveLength(2);
            expect(playlists[0].owner).toBe(userId);
        });
    });

    describe('addSong', () => {
        it('should add song to playlist', async () => {
            const userId = 'user_123';
            const playlist = await SharedPlaylist.create({
                name: 'P1',
                owner: userId,
                songs: []
            });
            const songId = new mongoose.Types.ObjectId().toString();

            const updated = await playlistService.addSong((playlist as any)._id.toString(), songId, userId);

            expect(updated?.songs).toHaveLength(1);
            expect(updated?.songs[0].toString()).toBe(songId);
        });

        it('should throw if user is not authorized', async () => {
            const userId = 'user_123';
            const otherUser = 'user_456';
            const playlist = await SharedPlaylist.create({ name: 'P1', owner: userId });
            const songId = new mongoose.Types.ObjectId().toString();

            await expect(playlistService.addSong((playlist as any)._id.toString(), songId, otherUser))
                .rejects.toThrow('Not authorized');
        });
    });
});
