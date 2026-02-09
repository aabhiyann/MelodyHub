import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayerStore } from '@/stores/PlayerStore';

describe('Player Store', () => {
    beforeEach(() => {
        const { setState } = usePlayerStore;
        setState({
            currentSong: null,
            isPlaying: false,
            queue: [],
            currentIndex: -1,
            volume: 70,
            isMuted: false,
            currentTime: 0,
            duration: 0,
            isLyricsOpen: false,
        });
    });

    it('initializes with default state', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.currentSong).toBeNull();
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.volume).toBe(70);
    });

    // Note: Complex logic like playAlbum mostly resides in PlayerManager which is integrated into the store.
    // We can test the exposed actions.

    it('toggles lyrics', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.isLyricsOpen).toBe(false);

        act(() => {
            result.current.toggleLyrics();
        });
        expect(result.current.isLyricsOpen).toBe(true);
    });

    it('updates volume', () => {
        const { result } = renderHook(() => usePlayerStore());

        act(() => {
            result.current.setVolume(50);
        });
        expect(result.current.volume).toBe(50);
    });

    it('toggles mute', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.isMuted).toBe(false);

        act(() => {
            result.current.toggleMute();
        });
        expect(result.current.isMuted).toBe(true);
    });

    it('toggles shortcuts guide', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.isShortcutsGuideOpen).toBe(false);

        act(() => {
            result.current.toggleShortcutsGuide();
        });
        expect(result.current.isShortcutsGuideOpen).toBe(true);
    });

    it('toggles expanded mode', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.isExpanded).toBe(false);

        act(() => {
            result.current.toggleExpanded();
        });
        expect(result.current.isExpanded).toBe(true);
    });

    it('toggles queue', () => {
        const { result } = renderHook(() => usePlayerStore());

        expect(result.current.isQueueOpen).toBe(false);

        act(() => {
            result.current.toggleQueue();
        });
        expect(result.current.isQueueOpen).toBe(true);
    });

    it('updates duration', () => {
        const { result } = renderHook(() => usePlayerStore());

        act(() => {
            result.current.setDuration(200);
        });
        expect(result.current.duration).toBe(200);
    });

    it('updates buffered time', () => {
        const { result } = renderHook(() => usePlayerStore());

        act(() => {
            result.current.setBufferedTime(50);
        });
        expect(result.current.bufferedTime).toBe(50);
    });

    it('seeks to specific time', () => {
        const { result } = renderHook(() => usePlayerStore());

        act(() => {
            result.current.seek(45);
        });
        expect(result.current.currentTime).toBe(45);
    });

    it('sets current time', () => {
        const { result } = renderHook(() => usePlayerStore());

        act(() => {
            result.current.setCurrentTime(30);
        });
        expect(result.current.currentTime).toBe(30);
    });
});
