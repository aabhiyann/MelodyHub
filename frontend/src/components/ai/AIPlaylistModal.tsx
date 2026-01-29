/**
 * AIPlaylistModal Component
 * Premium, full-screen modal for AI playlist generation.
 * Orchestrates the flow: Prompt -> Processing -> Results
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useAIStore } from '@/stores/useAIStore';
import { ParticleBackground } from './ParticleBackground';
import { MelodyMascot } from './MelodyMascot';
import { StagePrompt } from './StagePrompt';
import { StageProcessing } from './StageProcessing';
import { StageResults } from './StageResults';

export const AIPlaylistModal = () => {
    const { isOpen, closeModal, stage } = useAIStore();

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeModal]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop with blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    />

                    {/* Gradient background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10 pointer-events-none" />

                    {/* Particle effects */}
                    <ParticleBackground />

                    {/* Modal content container */}
                    <motion.div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-modal rounded-3xl shadow-2xl border border-white/10 flex flex-col"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:rotate-90"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 flex flex-col items-center">

                            {/* Mascot - persistent across stages but with different states handled internally */}
                            {/* We shrink it slightly in results view to make room for song list */}
                            <div className="mb-6 shrink-0 transition-all duration-500">
                                <MelodyMascot size={stage === 'results' ? 'sm' : 'md'} />
                            </div>

                            {/* Stage Content Switcher */}
                            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
                                <AnimatePresence mode="wait">
                                    {stage === 'prompt' && <StagePrompt key="prompt" />}
                                    {stage === 'processing' && <StageProcessing key="processing" />}
                                    {stage === 'results' && <StageResults key="results" />}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
