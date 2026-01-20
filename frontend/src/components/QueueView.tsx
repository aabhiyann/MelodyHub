import { usePlayerStore } from "@/stores/PlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play } from "lucide-react";

const QueueView = () => {
    const { queue, currentSong, isPlaying, togglePlay, setCurrentSong } = usePlayerStore();

    // Filter queue to show upcoming songs (simple version just shows playing + rest)
    // For a real app we might want to slice the queue from current index

    return (
        <div className='h-full bg-background-elevated border-l border-border-subtle flex flex-col'>
            <div className='p-4 border-b border-border-subtle'>
                <h2 className='font-semibold text-text-primary text-xl'>Queue</h2>
            </div>

            <ScrollArea className='flex-1'>
                <div className='p-4 space-y-4'>
                    {/* Currently Playing */}
                    {currentSong && (
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Now Playing</h3>
                            <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/5">
                                <Avatar className='size-12 rounded-md'>
                                    <AvatarImage src={currentSong.imageUrl} alt={currentSong.title} className="object-cover" />
                                    <AvatarFallback>{currentSong.title[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-text-primary truncate">{currentSong.title}</h4>
                                    <p className="text-sm text-brand-primary truncate">{currentSong.artist}</p>
                                </div>
                                {isPlaying && (
                                    <div className="flex gap-1 items-end h-4">
                                        <span className="w-1 h-full bg-brand-primary animate-music-bar-1"></span>
                                        <span className="w-1 h-3 bg-brand-primary animate-music-bar-2"></span>
                                        <span className="w-1 h-2 bg-brand-primary animate-music-bar-3"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Up Next */}
                    <div>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Up Next</h3>
                        <div className="space-y-2">
                            {queue.map((song, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => setCurrentSong(song)}
                                >
                                    <div className="relative size-10 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="size-4 text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-text-primary text-sm truncate group-hover:text-white transition-colors">{song.title}</h4>
                                        <p className="text-xs text-text-secondary truncate">{song.artist}</p>
                                    </div>
                                </div>
                            ))}
                            {queue.length === 0 && (
                                <p className="text-sm text-text-tertiary italic">Your queue is empty.</p>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default QueueView;
