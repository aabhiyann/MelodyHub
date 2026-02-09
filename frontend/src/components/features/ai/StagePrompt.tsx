import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';
import { Button } from '@/components/ui/button';

export const StagePrompt = () => {
    const { userPrompt, setPrompt, generatePlaylist } = useAIStore();
    const [isFocused, setIsFocused] = useState(false);

    const EXAMPLE_PROMPTS = [
        "Upbeat songs for my morning run 🏃‍♂️",
        "Chill lo-fi for studying 📚",
        "90s nostalgic hits 📼",
        "Discover new indie artists 🎸",
        "Energetic EDM for the gym 💪",
        "Relaxing jazz for dinner 🍷",
        "Feel-good pop anthems ✨",
        "Rainy day acoustic vibes 🌧️"
    ];

    const handleSubmit = () => {
        if (!userPrompt.trim()) return;
        generatePlaylist({ prompt: userPrompt });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center w-full max-w-lg mx-auto"
        >
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    Create a playlist with AI
                </h3>
                <p className="text-text-secondary text-base md:text-lg">
                    Describe the mood, genre, or occasion
                </p>
            </div>

            {/* Input Area */}
            <div className={`relative w-full mb-8 transition-smooth ${isFocused ? 'scale-[1.02]' : ''}`}>
                <textarea
                    value={userPrompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="e.g. Upbeat pop for my morning run, chill lo-fi for studying..."
                    maxLength={250}
                    className="input-liquid w-full h-32 rounded-xl p-4 text-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-brand-primary/30 resize-none"
                />

                {/* Character Counter */}
                <span className={`absolute bottom-4 right-4 text-xs font-medium transition-colors ${userPrompt.length > 230 ? 'text-semantic-error' : 'text-text-tertiary'
                    }`}>
                    {userPrompt.length} / 250
                </span>
            </div>

            {/* Example Chips - pill style */}
            <div className="w-full mb-8">
                <p className="text-sm text-text-tertiary mb-3 text-center">Not sure? Try these:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => setPrompt(prompt)}
                            className="px-4 py-2.5 rounded-full bg-white/5 border border-border-subtle hover:bg-white/10 transition-smooth text-sm text-text-secondary hover:text-text-primary"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button - pill CTA */}
            <Button
                onClick={handleSubmit}
                disabled={!userPrompt.trim()}
                className="btn-liquid w-full h-14 text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 rounded-full shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
                <Sparkles className={`w-5 h-5 ${userPrompt.trim() ? 'animate-pulse' : ''}`} />
                Create Playlist
            </Button>
        </motion.div>
    );
};
