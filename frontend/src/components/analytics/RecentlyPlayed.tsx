import { Clock, Music } from "lucide-react";

interface RecentItem {
    songId?: {
        _id: string;
        title?: string;
        artist?: string;
        imageUrl?: string;
    };
    playedAt: string;
}

interface RecentlyPlayedProps {
    items: RecentItem[];
}

export const RecentlyPlayed = ({ items }: RecentlyPlayedProps) => {
    if (items.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="size-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-white">Recently Played</h3>
                </div>
                <p className="text-zinc-500 text-center py-12">No listening history yet.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="size-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">Recently Played</h3>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, i) => (
                    <div
                        key={`${item.songId?._id ?? i}-${item.playedAt}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <div className="relative size-10 rounded overflow-hidden flex-shrink-0">
                            <img
                                src={item.songId?.imageUrl || "/placeholder.jpg"}
                                alt={item.songId?.title || "Song"}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Music className="size-4 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {item.songId?.title || "Unknown Song"}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                                {item.songId?.artist || "Unknown Artist"}
                            </p>
                        </div>
                        <span className="text-xs text-zinc-500 flex-shrink-0">
                            {new Date(item.playedAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
