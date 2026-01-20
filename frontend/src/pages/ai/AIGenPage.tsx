import { useState } from "react";
import { useMusicStore } from "@/stores/MusicStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Play } from "lucide-react";
import MelodyAvatar from "./components/MelodyAvatar";
import { Song } from "@/types";
import MusicCard from "../home/components/MusicCard";
import Topbar from "@/components/Topbar";
import toast from "react-hot-toast";

const SUGGESTIONS = [
    "Upbeat workout from the 80s",
    "Chill lofi beats for studying",
    "Sad songs for a rainy day",
    "High energy pop hits",
    "Jazz for a dinner party"
];

const AIGenPage = () => {
    const { generatePlaylist } = useMusicStore();
    const { initializeQueue } = usePlayerStore();

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
    const [mascotState, setMascotState] = useState<'idle' | 'listening' | 'thinking' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setMascotState('thinking');
        setError(null);
        setGeneratedSongs([]);

        try {
            const songs = await generatePlaylist(prompt);
            setGeneratedSongs(songs);
            if (songs.length > 0) {
                setMascotState('success');
                toast.success(`Created a playlist with ${songs.length} songs!`);
            } else {
                setMascotState('error');
                setError("I couldn't find enough songs matching that description. Try something else!");
            }
        } catch (err) {
            setMascotState('error');
            setError("Oops! Something went wrong while thinking. Please try again.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlayAll = () => {
        if (generatedSongs.length > 0) {
            initializeQueue(generatedSongs);
        }
    };

    return (
        <main className="relative h-full w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 rounded-md">

            {/* Background Particles (Optional: Add real particles later) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 h-full flex flex-col">
                <Topbar />

                <ScrollArea className="flex-1">
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6 max-w-4xl mx-auto w-full">

                        {/* Mascot Section */}
                        <div className="mb-8 transform transition-all duration-500">
                            <MelodyAvatar
                                state={mascotState}
                                className="w-48 h-48 md:w-64 md:h-64"
                            />
                        </div>

                        {/* Conversation UI */}
                        {!generatedSongs.length && (
                            <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in-up">
                                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                    {isGenerating ? (
                                        <span className="animate-pulse">Crafting your mix...</span>
                                    ) : (
                                        "What's your vibe today?"
                                    )}
                                </h1>

                                {!isGenerating && (
                                    <>
                                        {/* Input Box */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                                            <div className="relative flex items-center bg-zinc-900/90 border border-white/10 rounded-xl p-2 shadow-2xl">
                                                <input
                                                    type="text"
                                                    value={prompt}
                                                    onChange={(e) => {
                                                        setPrompt(e.target.value);
                                                        setMascotState('listening');
                                                    }}
                                                    onBlur={() => !isGenerating && setMascotState('idle')}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                                    placeholder="Describe your perfect playlist..."
                                                    className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 text-lg px-4 py-3 focus:outline-none focus:ring-0"
                                                    autoFocus
                                                />
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={!prompt.trim() || isGenerating}
                                                    size="icon"
                                                    className="h-12 w-12 rounded-lg bg-brand-primary hover:bg-brand-primary/90 shrink-0"
                                                >
                                                    {isGenerating ? <Sparkles className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Suggestions chips */}
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {SUGGESTIONS.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    onClick={() => {
                                                        setPrompt(suggestion);
                                                        setMascotState('listening');
                                                    }}
                                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Results View */}
                        {generatedSongs.length > 0 && (
                            <div className="w-full space-y-8 animate-fade-in-up">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-white">Here's your mix</h2>
                                        <p className="text-zinc-400">Based on "{prompt}"</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setGeneratedSongs([]);
                                                setPrompt("");
                                                setMascotState('idle');
                                            }}
                                        >
                                            Start Over
                                        </Button>
                                        <Button
                                            onClick={handlePlayAll}
                                            className="bg-brand-primary hover:bg-brand-primary/90"
                                        >
                                            <Play className="h-4 w-4 mr-2" /> Play All
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {generatedSongs.map((song) => (
                                        <MusicCard
                                            key={song._id}
                                            song={song}
                                            onClick={() => initializeQueue(generatedSongs)}
                                            onPlayClick={(e) => {
                                                e.stopPropagation();
                                                initializeQueue(generatedSongs);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200">
                                {error}
                            </div>
                        )}

                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};

export default AIGenPage;
