import { usePlayerStore } from "@/stores/PlayerStore";
import { useEffect, useState } from "react";
import { X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const LyricsView = () => {
    const { currentSong, isLyricsOpen, toggleLyrics } = usePlayerStore();
    const [isVisible, setIsVisible] = useState(false);

    // Simple animation delay for smooth entrance
    useEffect(() => {
        if (isLyricsOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isLyricsOpen]);

    if (!isVisible && !isLyricsOpen) return null;

    return (
        <div
            className={`absolute inset-0 z-40 transition-all duration-500 ease-in-out ${isLyricsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
            {/* Dynamic Blurry Background */}
            <div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-3xl overflow-hidden">
                {currentSong && (
                    <div className="absolute inset-0 opacity-30 scale-150 blur-[100px] transition-all duration-[2000ms]">
                        <img
                            src={currentSong.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col p-8 md:p-16 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-xl shadow-2xl overflow-hidden border border-white/10 hidden md:block">
                            <img src={currentSong?.imageUrl} alt={currentSong?.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{currentSong?.title}</h2>
                            <p className="text-xl text-white/60 font-medium">{currentSong?.artist}</p>
                        </div>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-12 w-12 hover:bg-white/10 text-white/70 hover:text-white"
                        onClick={toggleLyrics}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                {/* Lyrics Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 mask-fade-y">
                    <div className="space-y-8 py-10">
                        {/* Placeholder Lyrics - In a real app, this would come from an API */}
                        {currentSong ? (
                            <>
                                <p className="text-3xl font-semibold text-white/90 leading-relaxed hover:text-white transition-colors cursor-pointer origin-left hover:scale-[1.02] duration-300">
                                    (Instrumental Intro)
                                </p>
                                <p className="text-3xl font-semibold text-white/40 leading-relaxed hover:text-white transition-colors cursor-pointer origin-left hover:scale-[1.02] duration-300">
                                    [Lyrics for "{currentSong.title}" are fetching...]
                                </p>
                                <p className="text-3xl font-semibold text-white/40 leading-relaxed hover:text-white transition-colors cursor-pointer origin-left hover:scale-[1.02] duration-300">
                                    Imagine the most beautiful poetry here.
                                </p>
                                <p className="text-3xl font-semibold text-white/40 leading-relaxed hover:text-white transition-colors cursor-pointer origin-left hover:scale-[1.02] duration-300">
                                    Lines drifting like clouds in the sky.
                                </p>
                                <p className="text-3xl font-semibold text-white/40 leading-relaxed hover:text-white transition-colors cursor-pointer origin-left hover:scale-[1.02] duration-300">
                                    Syncing perfectly with the rhythm.
                                </p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/30">
                                <Music className="w-24 h-24 mb-6 opacity-20" />
                                <p className="text-2xl">Play a song to see lyrics</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LyricsView;
