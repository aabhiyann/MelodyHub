import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlaylistSongRow } from '../PlaylistSongRow';

// Mocks
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, className }: any) => (
            <div onClick={onClick} className={className} data-testid="motion-row">
                {children}
            </div>
        ),
    },
    useAnimation: () => ({ start: vi.fn() }),
}));

vi.mock('@/components/shared/OptimizedImage', () => ({
    OptimizedImage: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} />
    ),
}));

// Mock the imported format function to avoid importing from a page
vi.mock('@/pages/AlbumPage', () => ({
    formatDuration: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
}));


describe('PlaylistSongRow', () => {
    const mockSong = {
        _id: '1',
        title: 'Test Song',
        artist: 'Test Artist',
        albumId: 'album1',
        imageUrl: 'img.jpg',
        audioUrl: 'audio.mp3',
        duration: 185, // 3:05
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const mockOnClick = vi.fn();

    it('renders song details correctly', () => {
        render(
            <PlaylistSongRow
                song={mockSong}
                index={0}
                isCurrentSong={false}
                isPlaying={false}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Test Song')).toBeDefined();
        expect(screen.getByText('Test Artist')).toBeDefined();
        expect(screen.getByText('3:05')).toBeDefined();
        expect(screen.getByAltText('Test Song')).toBeDefined();
        expect(screen.getByText('1')).toBeDefined(); // Index + 1
    });

    it('highlights current playing song', () => {
        render(
            <PlaylistSongRow
                song={mockSong}
                index={0}
                isCurrentSong={true}
                isPlaying={true}
                onClick={mockOnClick}
            />
        );

        const row = screen.getByTestId('motion-row');
        expect(row.className).toContain('bg-brand-primary/10');
        expect(screen.queryByText('1')).toBeNull(); // Index hidden when playing
    });

    it('calls onClick when clicked', () => {
        render(
            <PlaylistSongRow
                song={mockSong}
                index={0}
                isCurrentSong={false}
                isPlaying={false}
                onClick={mockOnClick}
            />
        );

        fireEvent.click(screen.getByTestId('motion-row'));
        expect(mockOnClick).toHaveBeenCalled();
    });
});
