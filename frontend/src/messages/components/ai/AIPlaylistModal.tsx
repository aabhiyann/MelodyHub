import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';

interface AIPlaylistModalProps {
    children: React.ReactNode;
}

export const AIPlaylistModal = ({ children }: AIPlaylistModalProps) => {
    const { isOpen, closeModal } = useAIStore();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-2xl bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl mx-4 max-h-[90vh] flex flex-col"
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300 hover:rotate-90"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 flex flex-col h-full bg-glass p-6 md:p-12 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
