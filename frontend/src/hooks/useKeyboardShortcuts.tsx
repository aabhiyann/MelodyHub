import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';

/**
 * Global keyboard shortcuts for music player
 * 
 * Shortcuts:
 * - Space/K: Play/Pause
 * - J/Arrow Left: Seek backward 5 seconds
 * - L/Arrow Right: Seek forward 5 seconds
 * - Arrow Up/Down: Volume up/down (10%)
 * - M: Mute/Unmute
 * - Shift+L: Like current song
 * - S: Shuffle toggle
 * - R: Repeat toggle
 * - ?: Toggle Shortcuts Guide
 */
export const useKeyboardShortcuts = (enabled = true) => {
    const {
        currentSong,
        volume,
        currentTime,
        duration,
        togglePlay,
        setVolume,
        toggleMute,
        seek,
        shuffleQueue,
        toggleRepeat,
        toggleShortcutsGuide,
    } = usePlayerStore();

    useEffect(() => {
        if (!enabled) return;

        const handleKeyPress = async (e: KeyboardEvent) => {
            // Ignore if user is typing in input/textarea/contenteditable
            const target = e.target as HTMLElement;
            const isTyping =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isTyping) return;

            // Prevent default for media keys
            const mediaKeys = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'k', 'j', 'l', '?'];
            if (mediaKeys.includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key.toLowerCase()) {
                // Play/Pause
                case ' ':
                case 'k':
                    togglePlay();
                    break;

                // Seek backward 5 seconds
                case 'arrowleft':
                case 'j':
                    if (duration > 0) {
                        const newTime = Math.max(0, currentTime - 5);
                        seek(newTime);
                    }
                    break;

                // Seek forward 5 seconds
                case 'arrowright':
                    if (duration > 0) {
                        const newTime = Math.min(duration, currentTime + 5);
                        seek(newTime);
                    }
                    break;

                // Volume up 10%
                case 'arrowup':
                    setVolume(Math.min(100, volume + 10));
                    break;

                // Volume down 10%
                case 'arrowdown':
                    setVolume(Math.max(0, volume - 10));
                    break;

                // Mute/Unmute
                case 'm':
                    toggleMute();
                    break;

                // Like song (Shift+L) or Seek (L)
                case 'l':
                    if (e.shiftKey && currentSong) {
                        try {
                            const { axiosInstance } = await import('@/lib/axios');
                            await axiosInstance.post('/analytics/like-song', {
                                songId: currentSong._id,
                                liked: true
                            });
                            console.log('❤️ Liked:', currentSong.title);
                        } catch (error) {
                            console.error('Failed to like song:', error);
                        }
                    } else if (!e.shiftKey) {
                        // 'l' key seek forward
                        if (duration > 0) {
                            const newTime = Math.min(duration, currentTime + 5);
                            seek(newTime);
                        }
                    }
                    break;

                // Shuffle toggle
                case 's':
                    shuffleQueue();
                    break;

                // Repeat toggle
                case 'r':
                    toggleRepeat();
                    break;

                // Guide toggle
                case '?':
                    toggleShortcutsGuide();
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [
        enabled,
        currentSong,
        volume,
        currentTime,
        duration,
        togglePlay,
        setVolume,
        toggleMute,
        seek,
        shuffleQueue,
        toggleRepeat,
        toggleShortcutsGuide,
    ]);
};
