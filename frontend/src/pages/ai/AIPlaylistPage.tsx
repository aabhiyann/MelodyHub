import { AIPlaylistModal } from '@/messages/components/ai/AIPlaylistModal';
import { MelodyMascot } from '@/messages/components/ai/MelodyMascot';
import { StagePrompt } from '@/messages/components/ai/StagePrompt';
import { StageProcessing } from '@/messages/components/ai/StageProcessing';
import { StageResults } from '@/messages/components/ai/StageResults';
import { useAIStore } from '@/stores/useAIStore';
import { AnimatePresence } from 'framer-motion';

export const AIPlaylistPage = () => {
    const { stage } = useAIStore();

    return (
        <AIPlaylistModal>
            {/* Mascot - persistent across stages but with different states handled internally */}
            <MelodyMascot size={stage === 'results' ? 'sm' : 'md'} />

            {/* Stage Content Switcher */}
            <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {stage === 'prompt' && <StagePrompt key="prompt" />}
                    {stage === 'processing' && <StageProcessing key="processing" />}
                    {stage === 'results' && <StageResults key="results" />}
                </AnimatePresence>
            </div>
        </AIPlaylistModal>
    );
};
