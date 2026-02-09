import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlayerManager } from '../playerManager';
import { useChatStore } from '@/stores/ChatStore';
import { axiosInstance } from '@/lib/axios';

// Mock dependencies
vi.mock('@/stores/ChatStore', () => ({
    useChatStore: {
        getState: vi.fn()
    }
}));

vi.mock('@/lib/axios', () => ({
    axiosInstance: {
        post: vi.fn().mockResolvedValue({})
    }
}));

describe('PlayerManager', () => {
    let playerManager: PlayerManager;
    let mockSet: any;
    let mockGet: any;
    let mockSocket: any;
    let mockState: any;

    const mockSong1 = { _id: '1', title: 'Song 1', artist: 'Artist 1', albumId: 'a1', duration: 100, imageUrl: 'img1', audioUrl: 'url1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const mockSong2 = { _id: '2', title: 'Song 2', artist: 'Artist 2', albumId: 'a1', duration: 100, imageUrl: 'img2', audioUrl: 'url2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const mockQueue = [mockSong1, mockSong2];

    beforeEach(() => {
        vi.clearAllMocks();

        mockSet = vi.fn((update) => {
            // Simulate state update for get()
            if (typeof update === 'function') {
                mockState = { ...mockState, ...update(mockState) };
            } else {
                mockState = { ...mockState, ...update };
            }
        });

        // Initial state
        mockState = {
            queue: [],
            currentSong: null,
            currentIndex: -1,
            isPlaying: false,
            shuffled: false,
            isRepeating: false,
            currentTime: 0,
            duration: 100
        };

        mockGet = vi.fn(() => mockState);

        // Setup socket mock
        mockSocket = {
            connected: true,
            auth: { userId: 'user1' },
            emit: vi.fn()
        };
        (useChatStore.getState as any).mockReturnValue({ socket: mockSocket });

        playerManager = new PlayerManager(mockSet, mockGet);
    });

    describe('initializeQueue', () => {
        it('initializes queue with songs', () => {
            playerManager.initializeQueue(mockQueue);

            expect(mockSet).toHaveBeenCalledWith({
                queue: mockQueue,
                currentSong: mockSong1,
                currentIndex: 0,
                shuffled: false,
                isRepeating: false
            });
        });

        it('preserves current song if exists', () => {
            mockState.currentSong = mockSong2;
            mockState.currentIndex = 1;

            playerManager.initializeQueue(mockQueue);

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                currentSong: mockSong2,
                currentIndex: 1
            }));
        });
    });

    describe('playAlbum', () => {
        it('plays album starting from index', () => {
            playerManager.playAlbum(mockQueue, 1);

            expect(mockSocket.emit).toHaveBeenCalledWith("update_activity", {
                userId: 'user1',
                activity: `Playing ${mockSong2.title} by ${mockSong2.artist}`
            });

            expect(mockSet).toHaveBeenCalledWith({
                queue: mockQueue,
                currentSong: mockSong2,
                currentIndex: 1,
                isPlaying: true,
                shuffled: false
            });
        });

        it('does nothing if songs empty', () => {
            playerManager.playAlbum([]);
            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe('playNext', () => {
        it('plays next song in queue', () => {
            mockState.queue = mockQueue;
            mockState.currentIndex = 0;
            mockState.currentSong = mockSong1;

            playerManager.playNext(true); // User skipped

            // Verify analytics tracking
            expect(axiosInstance.post).toHaveBeenCalledWith("/analytics/track-play", {
                songId: '1',
                completionRate: 0, // currentTime 0 / duration 100 = 0
                skipped: true
            });

            expect(mockSet).toHaveBeenCalledWith({
                currentSong: mockSong2,
                currentIndex: 1,
                isPlaying: true
            });
        });

        it('stops playing at end of queue', () => {
            mockState.queue = mockQueue;
            mockState.currentIndex = 1; // Last song

            playerManager.playNext();

            expect(mockSet).toHaveBeenCalledWith({ isPlaying: false });
        });

        it('calculates completion rate correctly', () => {
            mockState.queue = mockQueue;
            mockState.currentIndex = 0;
            mockState.currentSong = mockSong1;
            mockState.currentTime = 50;
            mockState.duration = 100;

            playerManager.playNext(true);

            expect(axiosInstance.post).toHaveBeenCalledWith("/analytics/track-play", {
                songId: '1',
                completionRate: 0.5,
                skipped: true
            });
        });
    });

    describe('playPrevious', () => {
        it('plays previous song', () => {
            mockState.queue = mockQueue;
            mockState.currentIndex = 1;
            mockState.currentSong = mockSong2;

            playerManager.playPrevious();

            expect(mockSet).toHaveBeenCalledWith({
                currentSong: mockSong1,
                currentIndex: 0,
                isPlaying: true
            });
        });

        it('stops if at beginning', () => {
            mockState.queue = mockQueue;
            mockState.currentIndex = 0;

            playerManager.playPrevious();

            expect(mockSet).toHaveBeenCalledWith({ isPlaying: false });
        });
    });

    describe('shuffleQueue', () => {
        it('shuffles queue and resets index', () => {
            mockState.queue = [...mockQueue, ...mockQueue]; // More items to shuffle

            playerManager.shuffleQueue();

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                shuffled: true,
                currentIndex: 0,
                isPlaying: true
            }));

            // Should contain queue property with shuffled array
            const call = mockSet.mock.calls[0][0];
            expect(call.queue).toHaveLength(4);
            expect(call.currentSong).toBeDefined();
        });
    });

    describe('togglePlay', () => {
        it('toggles playback state and emits activity', () => {
            mockState.isPlaying = false;
            mockState.currentSong = mockSong1;

            playerManager.togglePlay();

            expect(mockSet).toHaveBeenCalledWith({ isPlaying: true });
            expect(mockSocket.emit).toHaveBeenCalledWith("update_activity", {
                userId: 'user1',
                activity: `Playing ${mockSong1.title} by ${mockSong1.artist}`
            });
        });

        it('emits Idle when paused', () => {
            mockState.isPlaying = true;
            mockState.currentSong = mockSong1;

            // Simulate toggle -> set isPlaying false
            // But we can't easily simulate the effect of set() changing state mid-method unless expected.
            // In implementation: togglePlay() gets !isPlaying, then emits activity based on that new state?
            // Code: const isPlaying = !this.get().isPlaying;
            //       const activity = isPlaying && currentSong ? ... : "Idle";

            playerManager.togglePlay(); // becomes false

            expect(mockSet).toHaveBeenCalledWith({ isPlaying: false });
            expect(mockSocket.emit).toHaveBeenCalledWith("update_activity", {
                userId: 'user1',
                activity: 'Idle'
            });
        });
    });
});
