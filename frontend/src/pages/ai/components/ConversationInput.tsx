/**
 * ConversationInput Component 
 * Text input area with character counter and submit button
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptChips } from './PromptChips';

interface ConversationInputProps {
    onSubmit: (prompt: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    disabled?: boolean;
}

const MAX_LENGTH = 200;

export const ConversationInput = ({
    onSubmit,
    onFocus,
    onBlur,
    disabled = false,
}: ConversationInputProps) => {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        if (input.trim() && !disabled) {
            onSubmit(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
        }
    };

    const handleChipSelect = (prompt: string) => {
        setInput(prompt);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    What kind of music are you in the mood for?
                </h2>
                <p className="text-zinc-400 text-sm md:text-base">
                    Describe your vibe and I'll create the perfect playlist ✨
                </p>
            </motion.div>

            {/* Example prompt chips */}
            <PromptChips onSelect={handleChipSelect} />

            {/* Text input area */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    placeholder="e.g., Energetic songs for a morning road trip with friends..."
                    disabled={disabled}
                    className="w-full h-32 p-4 rounded-xl bg-white/10 border-2 border-white/20 focus:border-brand-primary text-white placeholder-zinc-400 resize-none transition-all duration-200 focus:ring-4 focus:ring-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    animate={{
                        boxShadow: isFocused
                            ? '0 0 0 4px rgba(88, 86, 214, 0.2)'
                            : '0 0 0 0px rgba(88, 86, 214, 0)',
                    }}
                />

                {/* Character counter and submit button */}
                <div className="flex justify-between items-center mt-3">
                    <span
                        className={`text-xs transition-colors ${input.length >= MAX_LENGTH
                                ? 'text-red-400 font-semibold'
                                : 'text-zinc-500'
                            }`}
                    >
                        {input.length}/{MAX_LENGTH}
                    </span>

                    <Button
                        onClick={handleSubmit}
                        disabled={!input.trim() || disabled}
                        className="bg-gradient-to-r from-brand-primary to-purple-600 hover:shadow-lg hover:shadow-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        size="lg"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Playlist
                    </Button>
                </div>

                {/* Keyboard shortcut hint */}
                <p className="text-xs text-zinc-500 mt-2 text-right">
                    Press <kbd className="px-2 py-1 rounded bg-white/10 text-xs">⌘ + Enter</kbd> to submit
                </p>
            </motion.div>
        </div>
    );
};
