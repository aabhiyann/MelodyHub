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
import { useGeminiPlaylist } from '@/hooks/useGeminiPlaylist';

interface AIPlaylistPageProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AIPlaylistPage = ({ isOpen, onClose }: AIPlaylistPageProps) => {
    const [mascotState, setMascotState] = useState<MascotState>('idle');
    const { generate, reset, loading, error, playlist } = useGeminiPlaylist();

    const handleGenerate = async (prompt: string) => {
        setMascotState('thinking');

        const result = await generate(prompt);

        if (result) {
            setMascotState('success');
            // Reset to idle after celebration
            setTimeout(() => setMascotState('idle'), 2000);
        } else {
            setMascotState('error');
            // Reset to idle after showing error
            setTimeout(() => setMascotState('idle'), 2000);
        }
    };

    const handleReset = () => {
        reset();
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
            {!loading && !playlist && (
                <>
                    <MelodyMascot state={mascotState} size="lg" />

                    <ConversationInput
                        onSubmit={handleGenerate}
                        onFocus={() => setMascotState('listening')}
                        onBlur={() => !loading && setMascotState('idle')}
                        disabled={loading}
                    />

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <MelodyMascot state="error" size="sm" />
                            <p className="text-red-400 text-center">{error}</p>
                            <button
                                onClick={handleReset}
                                className="mt-3 mx-auto block px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </>
            )}

            {loading && <LoadingState />}

            {!loading && playlist && (
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
