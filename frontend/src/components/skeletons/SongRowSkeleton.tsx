interface SongRowSkeletonProps {
  count?: number;
}

export const SongRowSkeleton = ({ count = 10 }: SongRowSkeletonProps) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md"
        >
          {/* Index placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-2 h-4 skeleton-shimmer rounded" />
          </div>

          {/* Song info placeholder */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 skeleton-shimmer rounded" />
              <div className="h-3 w-1/2 skeleton-shimmer rounded" />
            </div>
          </div>

          {/* Metadata placeholder */}
          <div className="flex items-center">
            <div className="h-3 w-20 skeleton-shimmer rounded" />
          </div>

          {/* Duration placeholder */}
          <div className="flex items-center">
            <div className="h-3 w-10 skeleton-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
