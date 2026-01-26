import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AudioPlayer from '../components/AudioPlayer';
import { usePlayerStore } from '../stores/PlayerStore'; // Relative import

// Mock Player Store
const mockPlayNext = vi.fn();
const mockSetVolume = vi.fn();
const mockSeek = vi.fn();

const mockStore = {
    currentSong: null,
    isPlaying: false,
    playNext: mockPlayNext,
    volume: 80,
    isMuted: false,
    setVolume: mockSetVolume,
    toggleMute: vi.fn(),
    currentTime: 0,
    duration: 100,
    bufferedTime: 0,
    setCurrentTime: vi.fn(),
    setDuration: vi.fn(),
    setBufferedTime: vi.fn(),
    seek: mockSeek,
    queue: [],
    toggleQueue: vi.fn(),
    isExpanded: false,
    toggleExpanded: vi.fn(),
};

vi.mock('../stores/PlayerStore', () => ({
    usePlayerStore: vi.fn(() => mockStore)
}));

// Mock child components to verify props and existence
vi.mock('../components/player/NowPlaying', () => ({
    NowPlaying: () => <div data-testid="now-playing">Now Playing</div>
}));
vi.mock('../components/player/PlaybackControls', () => ({
    PlaybackControls: () => <div data-testid="playback-controls">Controls</div>
}));
vi.mock('../components/player/ProgressBar', () => ({
    ProgressBar: () => <div data-testid="progress-bar">Progress</div>
}));
vi.mock('../components/player/AdditionalControls', () => ({
    AdditionalControls: () => <div data-testid="additional-controls">Additional</div>
}));

// Mock keyboard controls hook
vi.mock('@/hooks/useKeyboardControls', () => ({
    useKeyboardControls: vi.fn()
}));

describe('AudioPlayer', () => {

    // Have to update the mock implementation for specific tests
    const setStore = (overrides: any) => {
        vi.mocked(usePlayerStore).mockReturnValue({
            ...mockStore,
            ...overrides
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        setStore({});
    });

    it('renders nothing if no current song', () => {
        setStore({ currentSong: null });
        render(<AudioPlayer />);
        // It renders just an audio tag which is invisible, and returns early
        expect(screen.queryByTestId('now-playing')).not.toBeInTheDocument();
        expect(screen.queryByTestId('playback-controls')).not.toBeInTheDocument();
    });

    it('renders player UI when song is present', () => {
        setStore({
            currentSong: {
                title: 'Test Song',
                artist: 'Test Artist',
                audioUrl: 'test.mp3',
                imageUrl: 'test.jpg'
            }
        });

        render(<AudioPlayer />);
        expect(screen.getByTestId('now-playing')).toBeInTheDocument();
        expect(screen.getByTestId('playback-controls')).toBeInTheDocument();
        expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
        expect(screen.getByTestId('additional-controls')).toBeInTheDocument();
    });
});
