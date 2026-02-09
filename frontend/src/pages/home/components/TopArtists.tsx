import { Crown, TrendingUp, Music } from "lucide-react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

interface TopArtist {
    artist: string;
    count: number;
    imageUrl?: string;
}

interface TopArtistsProps {
    artists: TopArtist[];
}

export const TopArtists = ({ artists }: TopArtistsProps) => {
    if (!artists || artists.length < 3) return null;

    // Arrange for podium: [2nd, 1st, 3rd]
    const podiumArtists = [artists[1], artists[0], artists[2]];

    return (
        <section className="py-8">
            <div className="flex items-center gap-2 mb-8 px-4 md:px-0 justify-center text-center">
                <Crown className="size-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Your Top Artists This Month</h3>
            </div>

            <div className="flex justify-center items-end gap-4 px-4 h-[300px]">
                {podiumArtists.map((artist, index) => {
                    if (!artist) return null;
                    // Index 0 is 2nd place, Index 1 is 1st place, Index 2 is 3rd place
                    const isWinner = index === 1;
                    const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
                    const height = isWinner ? "h-[200px]" : index === 0 ? "h-[160px]" : "h-[140px]";
                    const color = isWinner ? "bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border-yellow-500/20" :
                        "bg-gradient-to-t from-zinc-800 to-zinc-800/50 border-white/5";

                    return (
                        <div key={artist.artist} className="flex flex-col items-center group relative w-1/3 max-w-[140px]">
                            {/* Artist Image */}
                            <div className={`relative mb-4 rounded-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2
                                ${isWinner ? 'size-32 border-4 border-yellow-500/50 shadow-yellow-500/20' : 'size-24 border-2 border-zinc-700'}
                            `}>
                                <OptimizedImage
                                    src={artist.imageUrl || "/placeholder.jpg"}
                                    alt={artist.artist}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute top-0 left-0 size-8 flex items-center justify-center rounded-br-xl font-bold text-sm
                                    ${isWinner ? 'bg-yellow-500 text-black' : 'bg-zinc-700 text-white'}
                                `}>
                                    #{rank}
                                </div>
                            </div>

                            {/* Podium Box */}
                            <div className={`w-full ${height} rounded-t-2xl border-t border-x backdrop-blur-md flex flex-col items-center justify-start pt-4 px-2 text-center transition-colors ${color}`}>
                                <h4 className={`font-bold truncate w-full ${isWinner ? 'text-yellow-100 text-lg' : 'text-white text-sm'}`}>
                                    {artist.artist}
                                </h4>
                                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                    <Music className="size-3" /> {artist.count} plays
                                </p>
                                {isWinner && (
                                    <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1">
                                        <TrendingUp className="size-3" /> Top Fan
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* List for 4th and 5th */}
            {artists.length > 3 && (
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto px-4">
                    {artists.slice(3, 5).map((artist, i) => (
                        <div key={artist.artist} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="font-bold text-zinc-500 w-6">#{i + 4}</span>
                            <div className="size-10 rounded-full overflow-hidden">
                                <OptimizedImage src={artist.imageUrl || "/placeholder.jpg"} alt={artist.artist} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{artist.artist}</p>
                                <p className="text-xs text-zinc-500">{artist.count} plays</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
