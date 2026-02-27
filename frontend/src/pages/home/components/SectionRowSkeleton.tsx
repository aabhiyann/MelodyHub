/**
 * SectionRowSkeleton - One horizontal row of card placeholders + section title.
 * Used while section data is loading (no spinners).
 */

const CARD_WIDTH = 160;

export const SectionRowSkeleton = ({ cardCount = 6 }: { cardCount?: number }) => {
    return (
        <div className="relative mb-8">
            <div className="flex items-center justify-between px-6 mb-4">
                <div className="h-7 w-48 rounded bg-white/10 skeleton-shimmer" />
                <div className="h-4 w-14 rounded bg-white/10 skeleton-shimmer" />
            </div>
            <div className="flex gap-4 overflow-hidden px-6 pb-6">
                {Array.from({ length: cardCount }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 flex flex-col"
                        style={{ width: `${CARD_WIDTH}px` }}
                    >
                        <div
                            className="aspect-square rounded-[12px] bg-white/10 skeleton-shimmer mb-3"
                        />
                        <div className="h-3.5 w-3/4 rounded bg-white/10 skeleton-shimmer" />
                        <div className="h-3 w-1/2 rounded bg-white/10 skeleton-shimmer mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
};
