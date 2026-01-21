/**
 * AIPlaylistPage Component
 * Main AI playlist generation experience
 * Orchestrates all components and state management
 */

import { useState } from 'react';
import { AIPlaylistModal } from './components/AIPlaylistModal';
import { MelodyMascot, MascotState } from './components/MelodyMascot';
import { ConversationInput } from './components/ConversationInput';
import { LoadingState } from './components/LoadingState';
import { PlaylistPreview } from './components/PlaylistPreview';

// Mock playlist generation (will be replaced with Gemini API)
const generateMockPlaylist = async (prompt: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
        name: `${prompt} Vibes`,
        description: `A curated collection of tracks perfect for ${prompt.toLowerCase()}.`,
        tracks: [
            { title: 'Upbeat Anthem', artist: 'Energy Band', reason: 'Perfect opener' },
            { title: 'Motivation Mix', artist: 'Power Trio', reason: 'Keeps momentum' },
            { title: 'Feel Good Flow', artist: 'Vibe Collective' },
            { title: 'Energy Boost', artist: 'The Dynamos' },
            { title: 'Peak Performance', artist: 'Summit Sound' },
            { title: 'High Energy', artist: 'Pulse' },
            { title: 'Power Hour', artist: 'Drive Force' },
            { title: 'Unstoppable', artist: 'Momentum' },
            { title: 'Electric Vibes', artist: 'Current' },
            { title: 'Full Throttle', artist: 'Speed Sound' },
        ],
    };
};

interface AIPlaylistPageProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AIPlaylistPage = ({ isOpen, onClose }: AIPlaylistPageProps) => {
    const [mascotState, setMascotState] = useState<MascotState>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState<any | null>(null);

    const handleGenerate = async (prompt: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setMascotState('thinking');

            const result = await generateMockPlaylist(prompt);

            setPlaylist(result);
            setMascotState('success');
        } catch (err) {
            setError("Oops! Melody got confused. Let's try that again? 🎵");
            setMascotState('error');
        } finally {
            setIsLoading(false);
            // Reset to idle after a delay
            setTimeout(() => {
                if (!isLoading) setMascotState('idle');
            }, 2000);
        }
    };

    const handleReset = () => {
        setPlaylist(null);
        setError(null);
        setMascotState('idle');
    };

    const handleSave = () => {
        // TODO: Implement save to library
        alert('Playlist saved! (Feature coming soon)');
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
        alert('Edit functionality coming soon!');
    };

    return (
        <AIPlaylistModal isOpen={isOpen} onClose={onClose}>
            {!isLoading && !playlist && (
                <>
                    <MelodyMascot state={mascotState} size="lg" />

                    <ConversationInput
                        onSubmit={handleGenerate}
                        onFocus={() => setMascotState('listening')}
                        onBlur={() => !isLoading && setMascotState('idle')}
                        disabled={isLoading}
                    />

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <MelodyMascot state="error" size="sm" />
                            <p className="text-red-400 text-center">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="mt-3 mx-auto block px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </>
            )}

            {isLoading && <LoadingState />}

            {!isLoading && playlist && (
                <>
                    <MelodyMascot state="success" size="md" />

                    <PlaylistPreview
                        playlist={playlist}
                        onSave={handleSave}
                        onEdit={handleEdit}
                        onRegenerate={handleReset}
                    />
                </>
            )}
        </AIPlaylistModal>
    );
};
