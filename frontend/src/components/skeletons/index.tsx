/**
 * Skeleton components for loading states
 * Provides visual feedback while content is loading
 */

export const SongCardSkeleton = () => (
    <div className="glass p-4 rounded-lg animate-pulse">
        {/* Image skeleton */}
        <div className="aspect-square bg-white/5 rounded-md mb-4" />
        {/* Title skeleton */}
        <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
        {/* Artist skeleton */}
        <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
);

export const SongGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <SongCardSkeleton key={i} />
        ))}
    </div>
);

export const AlbumCardSkeleton = () => (
    <div className="glass p-6 rounded-lg animate-pulse">
        {/* Album image */}
        <div className="aspect-square bg-white/5 rounded-md mb-4" />
        {/* Album title */}
        <div className="h-5 bg-white/5 rounded w-4/5 mb-3" />
        {/* Artist name */}
        <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
        {/* Year */}
        <div className="h-3 bg-white/5 rounded w-1/3" />
    </div>
);

export const AlbumListSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <AlbumCardSkeleton key={i} />
        ))}
    </div>
);

export const ChatMessageSkeleton = () => (
    <div className="flex gap-3 p-3 animate-pulse">
        {/* Avatar */}
        <div className="size-10 rounded-full bg-white/5 shrink-0" />
        <div className="flex-1 space-y-2">
            {/* Username */}
            <div className="h-3 bg-white/5 rounded w-24" />
            {/* Message */}
            <div className="h-4 bg-white/5 rounded w-full max-w-xs" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
        </div>
    </div>
);

export const ChatListSkeleton = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <ChatMessageSkeleton key={i} />
        ))}
    </div>
);

export const FeaturedSectionSkeleton = () => (
    <div className="space-y-4 mb-8 animate-pulse">
        {/* Section header */}
        <div className="h-8 bg-white/5 rounded w-48 mb-6" />
        {/* Featured grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass p-4 rounded-lg">
                    <div className="aspect-video bg-white/5 rounded mb-3" />
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
            ))}
        </div>
    </div>
);

export const PageLoadingSkeleton = () => (
    <div className="p-6 space-y-8">
        {/* Header skeleton */}
        <div className="animate-pulse">
            <div className="h-10 bg-white/5 rounded w-64 mb-4" />
            <div className="h-4 bg-white/5 rounded w-96" />
        </div>

        {/* Content sections */}
        <div className="space-y-8">
            <FeaturedSectionSkeleton />
            <div className="space-y-4">
                <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
                <SongGridSkeleton count={8} />
            </div>
        </div>
    </div>
);

export const UserListSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                {/* Avatar */}
                <div className="size-12 rounded-full bg-white/5 shrink-0" />
                {/* User info */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-24" />
                </div>
            </div>
        ))}
    </div>
);
