import { Crown, TrendingUp, Music } from "lucide-react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { EmptyState } from "@/components/shared/EmptyState";

interface TopArtist {
    artist: string;
    count: number;
    imageUrl?: string;
}

interface TopArtistsProps {
    artists: TopArtist[];
}

export const TopArtists = ({ artists }: TopArtistsProps) => {
    if (!artists?.length) return null;
    if (artists.length < 3) {
        return (
            <section className="py-8">
                <div className="flex items-center gap-2 mb-6 px-4 md:px-0 justify-center">
                    <Crown className="size-6 text-[#22C55E]" />
                    <h3 className="text-xl md:text-2xl font-bold text-[#F9FAFB] tracking-tight">Your Top Artists This Month</h3>
                </div>
                <div className="rounded-[12px] bg-[#101019] border border-[#1F2933] mx-4 md:mx-0">
                    <EmptyState
                        message="Not enough plays yet"
                        secondary="Keep listening to see your top artists here."
                    />
                </div>
            </section>
        );
    }

    // Arrange for podium: [2nd, 1st, 3rd]
    const podiumArtists = [artists[1], artists[0], artists[2]];

    return (
        <section className="py-8">
            <div className="flex items-center gap-2 mb-8 px-4 md:px-0 justify-center text-center">
                <Crown className="size-6 text-[#22C55E]" />
                <h3 className="text-xl md:text-2xl font-bold text-[#F9FAFB] tracking-tight">Your Top Artists This Month</h3>
            </div>

            <div className="flex justify-center items-end gap-4 px-4 h-[300px]">
                {podiumArtists.map((artist, index) => {
                    if (!artist) return null;
                    // Index 0 is 2nd place, Index 1 is 1st place, Index 2 is 3rd place
                    const isWinner = index === 1;
                    const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
                    const height = isWinner ? "h-[200px]" : index === 0 ? "h-[160px]" : "h-[140px]";
                    const color = isWinner ? "bg-gradient-to-t from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E]/30" :
                        "bg-gradient-to-t from-[#1F2933] to-[#101019] border-[#1F2933]";

                    return (
                        <div key={artist.artist} className="flex flex-col items-center group relative w-1/3 max-w-[140px]">
                            {/* Artist Image */}
                            <div className={`relative mb-4 rounded-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2
                                ${isWinner ? 'size-32 border-4 border-[#22C55E]/50 shadow-[#22C55E]/20' : 'size-24 border-2 border-[#1F2933]'}
                            `}>
                                <OptimizedImage
                                    src={artist.imageUrl || "/placeholder.jpg"}
                                    alt={artist.artist}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute top-0 left-0 size-8 flex items-center justify-center rounded-br-xl font-bold text-sm
                                    ${isWinner ? 'bg-[#22C55E] text-[#020617]' : 'bg-[#1F2933] text-[#F9FAFB]'}
                                `}>
                                    #{rank}
                                </div>
                            </div>

                            {/* Podium Box */}
                            <div className={`w-full ${height} rounded-t-2xl border-t border-x backdrop-blur-md flex flex-col items-center justify-start pt-4 px-2 text-center transition-colors ${color}`}>
                                <h4 className={`font-bold truncate w-full ${isWinner ? 'text-[#F9FAFB] text-lg' : 'text-[#F9FAFB] text-sm'}`}>
                                    {artist.artist}
                                </h4>
                                <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
                                    <Music className="size-3" /> {artist.count} plays
                                </p>
                                {isWinner && (
                                    <div className="mt-2 text-[10px] text-[#22C55E] flex items-center gap-1">
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
                        <div key={artist.artist} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#101019] border border-[#1F2933]">
                            <span className="font-bold text-[#6B7280] w-6">#{i + 4}</span>
                            <div className="size-10 rounded-full overflow-hidden">
                                <OptimizedImage src={artist.imageUrl || "/placeholder.jpg"} alt={artist.artist} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[#F9FAFB] truncate">{artist.artist}</p>
                                <p className="text-xs text-[#6B7280]">{artist.count} plays</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
