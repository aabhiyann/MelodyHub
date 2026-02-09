import { PlaylistService } from '../../services/playlist.service.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { createTestUser, createTestSong } from '../utils/factories.js';

describe('PlaylistService', () => {
    let playlistService: PlaylistService;

    beforeAll(async () => {
        await connect();
        playlistService = new PlaylistService();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('createPlaylist', () => {
        it('should create a new playlist', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'My Playlist',
                description: 'Test description',
                isPublic: true,
            });

            expect(playlist).toBeDefined();
            expect(playlist.name).toBe('My Playlist');
            expect(playlist.isPublic).toBe(true);
        });

        it('should default to private playlist', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'Private Playlist',
            });

            expect(playlist.isPublic).toBe(false);
        });
    });

    describe('getAllPlaylists', () => {
        it('should return user playlists', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            await playlistService.createPlaylist(userId, { name: 'Playlist 1' });
            await playlistService.createPlaylist(userId, { name: 'Playlist 2' });

            const playlists = await playlistService.getAllPlaylists(userId);

            expect(playlists.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('getPlaylistById', () => {
        it('should return playlist by ID', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const created = await playlistService.createPlaylist(userId, {
                name: 'Test Playlist',
                isPublic: true,
            });

            const found = await playlistService.getPlaylistById(String(created._id || ''));

            expect(found).toBeDefined();
            expect(found?.name).toBe('Test Playlist');
        });

        it('should return null if playlist not found', async () => {
            const playlist = await playlistService.getPlaylistById('000000000000000000000000');
            expect(playlist).toBeNull();
        });
    });

    describe('updatePlaylist', () => {
        it('should update playlist', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'Old Name',
            });

            const updated = await playlistService.updatePlaylist(
                String(playlist._id || ''),
                userId,
                { name: 'New Name' }
            );

            expect(updated?.name).toBe('New Name');
        });

        it('should throw error if not authorized', async () => {
            const user1 = await createTestUser();
            const user2 = await createTestUser();
            const userId1 = String(user1._id || '');
            const userId2 = String(user2._id || '');

            const playlist = await playlistService.createPlaylist(userId1, {
                name: 'Test',
            });

            await expect(
                playlistService.updatePlaylist(String(playlist._id || ''), userId2, { name: 'Hacked' })
            ).rejects.toThrow('Not authorized');
        });
    });

    describe('deletePlaylist', () => {
        it('should delete playlist', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'To Delete',
            });

            await playlistService.deletePlaylist(String(playlist._id || ''), userId);

            const found = await playlistService.getPlaylistById(String(playlist._id || ''));
            expect(found).toBeNull();
        });
    });

    describe('addSong', () => {
        it('should add song to playlist', async () => {
            const user = await createTestUser();
            const song = await createTestSong();
            const userId = String(user._id || '');
            const songId = String(song._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'Test Playlist',
            });

            const updated = await playlistService.addSong(
                String(playlist._id || ''),
                songId,
                userId
            );

            expect(updated?.songs).toHaveLength(1);
        });
    });

    describe('removeSong', () => {
        it('should remove song from playlist', async () => {
            const user = await createTestUser();
            const song = await createTestSong();
            const userId = String(user._id || '');
            const songId = String(song._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'Test Playlist',
            });

            await playlistService.addSong(String(playlist._id || ''), songId, userId);
            const updated = await playlistService.removeSong(
                String(playlist._id || ''),
                songId,
                userId
            );

            expect(updated?.songs).toHaveLength(0);
        });
    });

    describe('togglePublic', () => {
        it('should toggle playlist visibility', async () => {
            const user = await createTestUser();
            const userId = String(user._id || '');

            const playlist = await playlistService.createPlaylist(userId, {
                name: 'Test',
                isPublic: false,
            });

            const updated = await playlistService.togglePublic(
                String(playlist._id || ''),
                userId
            );

            expect(updated?.isPublic).toBe(true);
        });
    });
});
