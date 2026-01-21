/**
 * useKeyboardControls Hook
 * Global keyboard shortcuts for music player
 */

import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';

export const useKeyboardControls = () => {
    const {
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        togglePlay,
        playNext,
        playPrevious,
        setVolume,
        toggleMute,
        seek,
        shuffleQueue,
        toggleRepeat,
    } = usePlayerStore();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input field
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case ' ':
                    // Space: Play/Pause
                    e.preventDefault();
                    togglePlay();
                    break;

                case 'arrowleft':
                    // Arrow Left: Seek backward 5s or Previous track (with Shift)
                    e.preventDefault();
                    if (e.shiftKey) {
                        playPrevious();
                    } else {
                        const newTime = Math.max(0, currentTime - 5);
                        seek(newTime);
                    }
                    break;

                case 'arrowright':
                    // Arrow Right: Seek forward 5s or Next track (with Shift)
                    e.preventDefault();
                    if (e.shiftKey) {
                        playNext();
                    } else {
                        const newTime = Math.min(duration, currentTime + 5);
                        seek(newTime);
                    }
                    break;

                case 'arrowup':
                    // Arrow Up: Volume up
                    e.preventDefault();
                    const newVolumeUp = Math.min(100, volume + 10);
                    setVolume(newVolumeUp);
                    if (isMuted) toggleMute();
                    break;

                case 'arrowdown':
                    // Arrow Down: Volume down
                    e.preventDefault();
                    const newVolumeDown = Math.max(0, volume - 10);
                    setVolume(newVolumeDown);
                    break;

                case 'm':
                    // M: Mute/Unmute
                    e.preventDefault();
                    toggleMute();
                    break;

                case 's':
                    // S: Shuffle
                    e.preventDefault();
                    shuffleQueue();
                    break;

                case 'r':
                    // R: Repeat
                    e.preventDefault();
                    toggleRepeat();
                    break;

                case 'n':
                    // N: Next track
                    e.preventDefault();
                    playNext();
                    break;

                case 'p':
                    // P: Previous track (if not typing 'p' in search)
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        playPrevious();
                    }
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        togglePlay,
        playNext,
        playPrevious,
        setVolume,
        toggleMute,
        seek,
        shuffleQueue,
        toggleRepeat,
    ]);
};
