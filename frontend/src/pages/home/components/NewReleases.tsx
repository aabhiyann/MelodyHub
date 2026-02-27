import { Album } from "@/types";
import HorizontalScrollSection from "./HorizontalScrollSection";
import { SpotifyCard } from "./SpotifyCard";
import { SectionRowSkeleton } from "./SectionRowSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

interface NewReleasesProps {
    albums: Album[];
    isLoading: boolean;
}

export const NewReleases = ({ albums, isLoading }: NewReleasesProps) => {
    if (isLoading) {
        return <SectionRowSkeleton cardCount={6} />;
    }

    return (
        <HorizontalScrollSection
            title="New Releases"
            seeAllHref="/releases"
            seeAllLabel="See all"
        >
            {albums.length === 0 ? (
                <div className="flex-shrink-0 w-full min-w-[280px] px-6">
                    <EmptyState
                        message="No new releases"
                        secondary="New albums and singles will show up here."
                    />
                </div>
            ) : (
                albums.map((album) => (
                    <SpotifyCard
                        key={album._id}
                        imageUrl={album.imageUrl}
                        title={album.title}
                        description={album.artist}
                        href={`/album/${album._id}`}
                        width={180}
                    />
                ))
            )}
        </HorizontalScrollSection>
    );
};
