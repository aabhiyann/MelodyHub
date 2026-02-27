import { Song } from "@/types";
import { usePlayerStore } from "@/stores/PlayerStore";
import HorizontalScrollSection from "./HorizontalScrollSection";
import { SpotifyCard } from "./SpotifyCard";
import { SectionRowSkeleton } from "./SectionRowSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

interface RecommendedSectionProps {
    songs: Song[];
    isLoading: boolean;
    seedArtist?: string;
}

export const RecommendedSection = ({ songs, isLoading, seedArtist }: RecommendedSectionProps) => {
    const { playAlbum } = usePlayerStore();

    if (isLoading) {
        return <SectionRowSkeleton cardCount={6} />;
    }

    const subtitle = seedArtist ? `Because you listened to ${seedArtist}` : undefined;

    return (
        <HorizontalScrollSection
            title="Recommended for You"
            subtitle={subtitle}
            seeAllHref="/browse"
            seeAllLabel="See all"
        >
            {!songs?.length ? (
                <div className="flex-shrink-0 w-full min-w-[280px] px-6">
                    <EmptyState
                        message="Play something to see recommendations"
                        secondary="We'll suggest similar tracks and artists."
                    />
                </div>
            ) : (
                songs.map((song, i) => (
                    <SpotifyCard
                        key={`${song._id}-${i}`}
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
