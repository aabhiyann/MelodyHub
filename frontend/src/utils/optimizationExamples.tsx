/**
 * React optimization examples and helpers
 * Best practices for performance in MelodyHub
 */

import { memo, useMemo, useCallback } from 'react';
import { Song } from '@/types';

/**
 * Example: Optimized Song Card Component
 * Uses React.memo to prevent unnecessary re-renders
 */
interface SongCardProps {
    song: Song;
    onPlay: (songId: string) => void;
    onLike: (songId: string) => void;
}

export const OptimizedSongCard = memo<SongCardProps>(({ song, onPlay, onLike }) => {
    // Memoize callbacks to prevent re-creation on every render
    const handlePlay = useCallback(() => {
        onPlay(song._id);
    }, [song._id, onPlay]);

    const handleLike = useCallback(() => {
        onLike(song._id);
    }, [song._id, onLike]);

    return (
        <div className="song-card">
            <img src={song.imageUrl} alt={song.title} />
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleLike}>Like</button>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function - only re-render if song data changed
    return (
        prevProps.song._id === nextProps.song._id &&
        prevProps.song.title === nextProps.song.title &&
        prevProps.song.artist === nextProps.song.artist
    );
});

OptimizedSongCard.displayName = 'OptimizedSongCard';

/**
 * Zustand Selector Optimization Examples
 */

// ❌ BAD: Component re-renders on ANY state change
// const { songs, albums, artists, isLoading } = useMusicStore();

// ✅ GOOD: Component only re-renders when songs change
// const songs = useMusicStore((state) => state.songs);

// ✅ GOOD: Use shallow equality for multiple selections
// const { songs, isLoading } = useMusicStore(
//   (state) => ({ songs: state.songs, isLoading: state.isLoading }),
//   shallow
// );

/**
 * useMemo Example: Expensive calculations
 */
export function useFilteredSongs(songs: Song[], searchQuery: string) {
    return useMemo(() => {
        if (!searchQuery) return songs;

        const query = searchQuery.toLowerCase();
        return songs.filter(
            (song) =>
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query)
        );
    }, [songs, searchQuery]); // Only recalculate when songs or query changes
}

/**
 * useCallback Example: Event handlers
 */
export function useOptimizedHandlers(onSongChange: (song: Song) => void) {
    // Without useCallback, this function is recreated on every render
    // With useCallback, it's only recreated when dependencies change
    const handleSongSelect = useCallback(
        (song: Song) => {
            console.log('Song selected:', song.title);
            onSongChange(song);
        },
        [onSongChange]
    );

    return { handleSongSelect };
}

/**
 * Performance Tips:
 * 
 * 1. Use React.memo for components that render often with same props
 * 2. Use useMemo for expensive calculations
 * 3. Use useCallback for event handlers passed to child components
 * 4. Use Zustand selectors to subscribe only to needed state
 * 5. Avoid inline object/array creation in JSX
 * 6. Use keys properly in lists
 * 7. Lazy load heavy components
 * 8. Debounce/throttle expensive operations
 */
