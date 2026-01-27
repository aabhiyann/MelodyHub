import { create } from 'zustand';
import { Song } from '@/types';
import { axiosInstance as axios } from '@/lib/axios';

export type AIStage = 'prompt' | 'processing' | 'results';
export type MascotState = 'idle' | 'listening' | 'thinking' | 'excited' | 'celebrating' | 'sad';

interface AIPlaylistRequest {
    prompt: string;
    context?: string;
}

interface GeneratedPlaylist {
    name: string;
    description: string;
    songs: Song[];
    reasoning?: string;
}

interface AIStore {
    isOpen: boolean;
    stage: AIStage;
    mascotState: MascotState;
    userPrompt: string;
    generatedPlaylist: GeneratedPlaylist | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    openModal: () => void;
    closeModal: () => void;
    setStage: (stage: AIStage) => void;
    setMascotState: (state: MascotState) => void;
    setPrompt: (prompt: string) => void;
    generatePlaylist: (request: AIPlaylistRequest) => Promise<void>;
    savePlaylist: () => Promise<void>;
    reset: () => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
    isOpen: false,
    stage: 'prompt',
    mascotState: 'idle',
    userPrompt: '',
    generatedPlaylist: null,
    isLoading: false,
    error: null,

    openModal: () => set({ isOpen: true, stage: 'prompt', mascotState: 'idle', error: null }),
    closeModal: () => set({ isOpen: false }),

    setStage: (stage) => set({ stage }),
    setMascotState: (state) => set({ mascotState: state }),
    setPrompt: (prompt) => set({ userPrompt: prompt }),

    generatePlaylist: async (request) => {
        set({
            isLoading: true,
            stage: 'processing',
            mascotState: 'thinking',
            error: null
        });

        try {
            const response = await axios.post('/ai/generate', request);
            const result: GeneratedPlaylist = response.data;

            set({
                generatedPlaylist: result,
                stage: 'results',
                mascotState: 'celebrating',
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || "Failed to generate playlist",
                mascotState: 'sad',
                isLoading: false,
                stage: 'prompt'
            });
        }
    },

    savePlaylist: async () => {
        const { generatedPlaylist } = get();
        if (!generatedPlaylist) return;

        set({ isLoading: true, error: null });
        try {
            const songIds = generatedPlaylist.songs.map((s: Song) => s._id);
            await axios.post('/social/playlists', {
                name: generatedPlaylist.name,
                description: generatedPlaylist.description,
                songs: songIds,
                isPublic: false
            });
            set({ isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || "Failed to save playlist"
            });
            throw error;
        }
    },

    reset: () => set({
        stage: 'prompt',
        mascotState: 'idle',
        userPrompt: '',
        generatedPlaylist: null,
        error: null,
        isLoading: false
    })
}));
