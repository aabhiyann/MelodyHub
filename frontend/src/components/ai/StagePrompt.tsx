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
            <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
                Hey! I'm Melody 🎵 <br />
                <span className="text-brand-primary">What kind of music vibe are you looking for?</span>
            </h3>

            {/* Input Area */}
            <div className={`relative w-full mb-8 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                <textarea
                    value={userPrompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Describe your perfect playlist..."
                    maxLength={250}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 resize-none transition-all"
                />

                {/* Character Counter */}
                <span className={`absolute bottom-4 right-4 text-xs font-medium transition-colors ${userPrompt.length > 230 ? 'text-red-400' : 'text-zinc-500'
                    }`}>
                    {userPrompt.length} / 250
                </span>
            </div>

            {/* Example Chips */}
            <div className="w-full mb-8">
                <p className="text-sm text-zinc-400 mb-3 text-center">Not sure? Try these:</p>
                <div className="flex flex-wrapjustify-center gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => setPrompt(prompt)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-105 transition-all text-sm text-zinc-300 hover:text-white"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                disabled={!userPrompt.trim()}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 transition-all rounded-xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
                <Sparkles className={`w-5 h-5 ${userPrompt.trim() ? 'animate-pulse' : ''}`} />
                Create Playlist
            </Button>
        </motion.div>
    );
};
