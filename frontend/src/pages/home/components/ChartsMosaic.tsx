import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import HorizontalScrollSection from "./HorizontalScrollSection";
import { SpotifyCard } from "./SpotifyCard";
import { SectionRowSkeleton } from "./SectionRowSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

interface ChartsMosaicProps {
    trendingSongs: Song[];
    featuredSongs: Song[];
    isLoading: boolean;
}

export const ChartsMosaic = ({ trendingSongs, featuredSongs, isLoading }: ChartsMosaicProps) => {
    const { playAlbum } = usePlayerStore();

    const items = [...(trendingSongs || []), ...(featuredSongs || [])].slice(0, 12);

    if (isLoading) {
        return <SectionRowSkeleton cardCount={6} />;
    }

    return (
        <HorizontalScrollSection
            title="Trending Now"
            seeAllHref="/browse"
            seeAllLabel="See all"
        >
            {items.length === 0 ? (
                <div className="flex-shrink-0 w-full min-w-[280px] px-6">
                    <EmptyState
                        message="No trending tracks yet"
                        secondary="Check back later for popular picks."
                    />
                </div>
            ) : (
                items.map((song) => (
                    <SpotifyCard
                        key={song._id}
                        imageUrl={song.imageUrl}
                        title={song.title}
                        description={song.artist}
                        onPlayClick={() => playAlbum([song], 0)}
                        width={160}
                    />
                ))
            )}
        </HorizontalScrollSection>
    );
};
