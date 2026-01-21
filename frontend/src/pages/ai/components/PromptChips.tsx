/**
 * PromptChips Component
 * Quick-select example prompts for AI playlist generation
 */

import { motion } from 'framer-motion';

interface PromptChipsProps {
    onSelect: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
    { text: 'Upbeat workout bangers', emoji: '💪' },
    { text: 'Chill study vibes', emoji: '📚' },
    { text: '90s nostalgia trip', emoji: '🎵' },
    { text: 'Rainy day relaxation', emoji: '🌧️' },
    { text: 'Party starters', emoji: '🎉' },
    { text: 'Focus deep work', emoji: '🎯' },
];

export const PromptChips = ({ onSelect }: PromptChipsProps) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
                <motion.button
                    key={prompt.text}
                    onClick={() => onSelect(prompt.text)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm transition-colors backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="mr-1">{prompt.emoji}</span>
                    {prompt.text}
                </motion.button>
            ))}
        </div>
    );
};
