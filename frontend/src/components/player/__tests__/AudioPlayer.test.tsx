import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AudioPlayer from '@/components/AudioPlayer';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useGamificationStore } from '@/stores/GamificationStore';
import { useChatStore } from '@/stores/ChatStore';

// Mock stores
vi.mock('@/stores/PlayerStore');
vi.mock('@/stores/GamificationStore');
vi.mock('@/stores/ChatStore');
vi.mock('@/hooks/useKeyboardControls', () => ({
    useKeyboardControls: vi.fn(),
}));

// Mock sub-components to isolate AudioPlayer logic vs UI structure
vi.mock('@/components/player/NowPlaying', () => ({
    NowPlaying: () => <div data-testid="now-playing">Now Playing</div>
}));
vi.mock('@/components/player/PlaybackControls', () => ({
    PlaybackControls: () => <div data-testid="playback-controls">Controls</div>
}));
vi.mock('@/components/player/ProgressBar', () => ({
    ProgressBar: () => <div data-testid="progress-bar">Progress</div>
}));
vi.mock('@/components/player/AdditionalControls', () => ({
    AdditionalControls: () => <div data-testid="additional-controls">Additional</div>
}));

describe('AudioPlayer', () => {
    beforeEach(() => {
        // Default mock implementation
        (usePlayerStore as any).mockReturnValue({
            currentSong: null,
            isPlaying: false,
            queue: [],
            togglePlay: vi.fn(),
            playNext: vi.fn(),
            volume: 70,
            isMuted: false,
            currentTime: 0,
            duration: 0,
        });
        (useGamificationStore as any).mockReturnValue({});
        (useChatStore as any).mockReturnValue({ updateActivity: vi.fn() });
    });

    it('renders nothing when no current song', () => {
        render(<AudioPlayer />);
        // When no song, it returns just an <audio> tag usually, or minimal UI.
        // The component says: if (!currentSong) return <audio ref={audioRef} />;
        expect(screen.queryByTestId('now-playing')).not.toBeInTheDocument();
    });

    it('renders player interface when song is present', () => {
        (usePlayerStore as any).mockReturnValue({
            currentSong: { title: 'Test', artist: 'Artist', audioUrl: 'test.mp3' },
            isPlaying: false,
            queue: [],
        });

        render(<AudioPlayer />);
        expect(screen.getByTestId('now-playing')).toBeInTheDocument();
        expect(screen.getByTestId('playback-controls')).toBeInTheDocument();
    });

    it('has accessible live region', () => {
        (usePlayerStore as any).mockReturnValue({
            currentSong: { title: 'Test', artist: 'Artist', audioUrl: 'test.mp3' },
            isPlaying: true,
            queue: [],
        });

        render(<AudioPlayer />);
        expect(screen.getByRole('status')).toHaveTextContent('Now playing: Test by Artist');
    });
});
