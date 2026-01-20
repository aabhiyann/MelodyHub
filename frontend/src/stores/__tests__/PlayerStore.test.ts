import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../PlayerStore';

describe('PlayerStore', () => {
    // Reset store before each test
    beforeEach(() => {
        usePlayerStore.setState({
            queue: [],
            currentSong: null,
            isPlaying: false,
            currentIndex: -1,
        });
    });

    it('should initialize with default state', () => {
        const state = usePlayerStore.getState();
        expect(state.queue).toEqual([]);
        expect(state.currentSong).toBeNull();
        expect(state.isPlaying).toBe(false);
        expect(state.currentIndex).toBe(-1);
    });

    it('should set the current song and update playing state', () => {
        const mockSong = { _id: '1', title: 'Test Song', artist: 'Test Artist', audioUrl: 'url', imageUrl: 'img', duration: 100, createdAt: '', updatedAt: '', albumId: null };

        usePlayerStore.getState().initializeQueue([mockSong]);
        usePlayerStore.getState().setCurrentSong(mockSong);

        const state = usePlayerStore.getState();
        expect(state.currentSong).toEqual(mockSong);
        expect(state.isPlaying).toBe(true);
        expect(state.currentIndex).toBe(0);
    });

    it('should toggle play state', () => {
        const { togglePlay } = usePlayerStore.getState();

        // Initial state is false
        expect(usePlayerStore.getState().isPlaying).toBe(false);

        togglePlay();
        expect(usePlayerStore.getState().isPlaying).toBe(true);

        togglePlay();
        expect(usePlayerStore.getState().isPlaying).toBe(false);
    });

    it('should play next song in queue', () => {
        const song1 = { _id: '1', title: 'Song 1', artist: 'A', audioUrl: 'u1', imageUrl: 'i1', duration: 100, createdAt: '', updatedAt: '', albumId: null };
        const song2 = { _id: '2', title: 'Song 2', artist: 'A', audioUrl: 'u2', imageUrl: 'i2', duration: 100, createdAt: '', updatedAt: '', albumId: null };

        usePlayerStore.getState().initializeQueue([song1, song2]);
        usePlayerStore.getState().setCurrentSong(song1);

        expect(usePlayerStore.getState().currentIndex).toBe(0);

        usePlayerStore.getState().playNext();

        const state = usePlayerStore.getState();
        expect(state.currentIndex).toBe(1);
        expect(state.currentSong?._id).toBe('2');
    });

    it('should play previous song in queue', () => {
        const song1 = { _id: '1', title: 'Song 1', artist: 'A', audioUrl: 'u1', imageUrl: 'i1', duration: 100, createdAt: '', updatedAt: '', albumId: null };
        const song2 = { _id: '2', title: 'Song 2', artist: 'A', audioUrl: 'u2', imageUrl: 'i2', duration: 100, createdAt: '', updatedAt: '', albumId: null };

        usePlayerStore.getState().initializeQueue([song1, song2]);
        // Start at second song
        usePlayerStore.getState().playAlbum([song1, song2], 1);

        expect(usePlayerStore.getState().currentIndex).toBe(1);

        usePlayerStore.getState().playPrevious();

        const state = usePlayerStore.getState();
        expect(state.currentIndex).toBe(0);
        expect(state.currentSong?._id).toBe('1');
    });
});
