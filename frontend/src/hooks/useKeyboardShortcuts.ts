import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/PlayerStore';

/**
 * Custom hook for global keyboard shortcuts
 * Provides media player controls via keyboard
 * 
 * Shortcuts:
 * - Space: Play/Pause
 * - ArrowLeft: Previous song
 * - ArrowRight: Next song
 * - ArrowUp: Volume up
 * - ArrowDown: Volume down
 * - M: Mute/Unmute
 */
export const useKeyboardShortcuts = (audioRef?: React.RefObject<HTMLAudioElement | null>) => {
    const { togglePlay, playNext, playPrevious, currentSong } = usePlayerStore();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs or textareas
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Don't interfere with modifier keys
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            switch (event.key) {
                case ' ': // Space - Play/Pause
                    event.preventDefault();
                    if (currentSong) {
                        togglePlay();
                    }
                    break;

                case 'ArrowLeft': // Previous song
                    event.preventDefault();
                    if (currentSong) {
                        playPrevious();
                    }
                    break;

                case 'ArrowRight': // Next song
                    event.preventDefault();
                    if (currentSong) {
                        playNext();
                    }
                    break;

                case 'ArrowUp': // Volume up
                    event.preventDefault();
                    if (audioRef?.current) {
                        const newVolume = Math.min(audioRef.current.volume + 0.1, 1);
                        audioRef.current.volume = newVolume;
                    }
                    break;

                case 'ArrowDown': // Volume down
                    event.preventDefault();
                    if (audioRef?.current) {
                        const newVolume = Math.max(audioRef.current.volume - 0.1, 0);
                        audioRef.current.volume = newVolume;
                    }
                    break;

                case 'm':
                case 'M': // Mute/Unmute
                    event.preventDefault();
                    if (audioRef?.current) {
                        audioRef.current.muted = !audioRef.current.muted;
                    }
                    break;

                default:
                    break;
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyPress);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [togglePlay, playNext, playPrevious, currentSong, audioRef]);
};
