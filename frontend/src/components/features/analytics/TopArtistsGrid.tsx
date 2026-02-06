import { User } from "lucide-react";

interface TopArtist {
    artist: string;
    playCount: number;
}

interface TopArtistsGridProps {
    artists: TopArtist[];
}

export const TopArtistsGrid = ({ artists }: TopArtistsGridProps) => {
    if (artists.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <User className="size-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-white">Top Artists</h3>
                </div>
                <p className="text-zinc-500 text-center py-12">Start listening to see your top artists!</p>
            </div>
        );
    }

    const maxPlays = Math.max(...artists.map((a) => a.playCount), 1);

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <User className="size-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">Top Artists</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artists.map((item, i) => (
                    <div
                        key={item.artist}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-center size-10 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-sm">
                            {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.artist}</p>
                            <p className="text-xs text-zinc-400">{item.playCount} plays</p>
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full bg-brand-primary rounded-full"
                                style={{ width: `${(item.playCount / maxPlays) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
