/**
 * Loading skeletons for route-level code splitting
 * Skeleton-only fallbacks (no spinners) while lazy-loaded components load
 */

const SKELETON_BG = 'bg-white/10';
const SKELETON_PULSE = 'animate-pulse';

/**
 * Route-specific skeleton layouts (pulse blocks only, no spinners)
 */
export type RouteSkeletonVariant =
    | 'home'
    | 'browse'
    | 'profile'
    | 'library'
    | 'playlist'
    | 'album'
    | 'artist'
    | 'search'
    | 'chat'
    | 'admin'
    | 'analytics'
    | 'generic';

interface RouteSkeletonProps {
    variant?: RouteSkeletonVariant;
    /** Use full viewport height for route-level Suspense fallback */
    fullHeight?: boolean;
}

const RowOfCards = ({ count = 5 }: { count?: number }) => (
    <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 flex flex-col">
                <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-3.5 w-3/4 rounded mt-2 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-3 w-1/2 rounded mt-1 ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        ))}
    </div>
);

export const RouteSkeleton = ({ variant = 'generic', fullHeight = true }: RouteSkeletonProps) => {
    const wrapperClass = fullHeight
        ? 'min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6'
        : 'h-full min-h-[50vh] rounded-2xl w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6';

    if (variant === 'home' || variant === 'browse') {
        return (
            <div className={wrapperClass}>
                <div className={`h-48 md:h-64 rounded-2xl mb-8 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="space-y-8">
                    <RowOfCards count={6} />
                    <RowOfCards count={6} />
                    <RowOfCards count={5} />
                </div>
            </div>
        );
    }

    if (variant === 'profile') {
        return (
            <div className={wrapperClass}>
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
                    <div className={`size-32 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className="flex-1 w-full space-y-2">
                        <div className={`h-8 w-48 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        <div className={`h-4 w-32 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        <div className="flex gap-6 mt-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`h-6 w-16 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`h-10 w-full rounded-lg mb-6 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'library') {
        return (
            <div className={wrapperClass}>
                <div className={`h-10 w-48 rounded-lg mb-6 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-3 w-1/2 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'playlist' || variant === 'album' || variant === 'artist') {
        return (
            <div className={wrapperClass}>
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className={`w-48 h-48 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className="flex-1 space-y-3">
                        <div className={`h-10 w-64 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        <div className={`h-4 w-32 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        <div className="flex gap-2 mt-4">
                            <div className={`h-10 w-24 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-10 w-24 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-2">
                            <div className={`size-10 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-4 flex-1 max-w-xs rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-4 w-12 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'search') {
        return (
            <div className={wrapperClass}>
                <div className={`h-12 w-full max-w-xl rounded-full mb-8 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-8 w-32 rounded mb-4 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                            <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'chat') {
        return (
            <div className={wrapperClass}>
                <div className="flex h-full min-h-[60vh] gap-0">
                    <div className={`w-64 border-r border-white/10 hidden md:block ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className="flex-1 flex flex-col">
                        <div className={`h-14 border-b border-white/10 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                        <div className="flex-1 p-4 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={`h-12 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`}
                                    style={{ width: i % 2 === 0 ? '70%' : '50%', marginLeft: i % 2 === 0 ? 0 : 'auto' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'admin') {
        return (
            <div className={wrapperClass}>
                <div className={`h-12 w-64 rounded mb-6 ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-28 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    ))}
                </div>
                <div className={`h-96 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        );
    }

    if (variant === 'analytics') {
        return (
            <div className={wrapperClass}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-24 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`h-72 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className={`h-72 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                </div>
            </div>
        );
    }

    // generic: simple content blocks
    return (
        <div className={wrapperClass}>
            <div className={`h-12 w-3/4 max-w-md rounded-lg mb-6 ${SKELETON_BG} ${SKELETON_PULSE}`} />
            <div className="space-y-4">
                <div className={`h-24 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-24 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-24 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        </div>
    );
};

/**
 * Full page loading skeleton (pulse only, no spinner)
 * Used for major route transitions
 */
export const PageLoadingSkeleton = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
            <div className="w-full max-w-2xl space-y-6">
                <div className={`h-12 w-48 rounded-lg ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-32 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-24 rounded-lg ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Minimal loading skeleton (pulse only)
 * Used for smaller component splits
 */
export const MinimalLoadingSkeleton = () => {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                ))}
            </div>
        </div>
    );
};

/**
 * Library tab content skeleton (grid of playlist-style cards)
 */
export const LibraryGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
                <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-3 w-1/2 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        ))}
    </div>
);

/**
 * Profile page skeleton (header + stats + tab content)
 */
export const ProfilePageSkeleton = () => (
    <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className={`size-32 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
            <div className="flex-1 w-full space-y-2">
                <div className={`h-8 w-48 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-4 w-32 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="flex gap-6 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-6 w-16 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    ))}
                </div>
            </div>
        </div>
        <div className={`h-10 w-full rounded-lg ${SKELETON_BG} ${SKELETON_PULSE}`} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                    <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                </div>
            ))}
        </div>
    </div>
);

/**
 * Analytics page skeleton (stats cards + chart areas)
 */
export const AnalyticsPageSkeleton = () => (
    <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-24 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`h-72 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
            <div className={`h-72 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
        </div>
    </div>
);

/**
 * List skeleton (e.g. followers, following, chat list)
 */
export const ListPageSkeleton = ({ rowCount = 8 }: { rowCount?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
                <div className={`size-12 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-4 flex-1 max-w-[200px] rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        ))}
    </div>
);

/**
 * Chat / friends list skeleton
 */
export const ChatListSkeleton = () => (
    <div className="p-4 space-y-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2">
                <div className={`size-10 rounded-full ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className="flex-1 space-y-1">
                    <div className={`h-4 w-32 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                    <div className={`h-3 w-24 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                </div>
            </div>
        ))}
    </div>
);

/**
 * Gamification / quests page skeleton
 */
export const GamificationPageSkeleton = () => (
    <div className="p-6 space-y-6">
        <div className={`h-32 rounded-2xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
        <div className={`h-12 w-full rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-28 rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
            ))}
        </div>
    </div>
);

/**
 * Search results skeleton
 */
export const SearchResultsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-2">
                <div className={`aspect-square rounded-xl ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-4 w-3/4 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
                <div className={`h-3 w-1/2 rounded ${SKELETON_BG} ${SKELETON_PULSE}`} />
            </div>
        ))}
    </div>
);

/**
 * Dashboard loading skeleton
 * Matches admin dashboard layout
 */
export const DashboardLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-zinc-50 p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div className="h-16 bg-white rounded-lg" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-white rounded-lg" />
                ))}
            </div>

            {/* Content */}
            <div className="h-96 bg-white rounded-lg" />
        </div>
    );
};

/**
 * Home page loading skeleton
 * Matches music library layout
 */
export const HomeLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 space-y-6">
            {/* Featured Section */}
            <div className="h-64 bg-white/5 rounded-lg animate-pulse" />

            {/* Grid of cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="aspect-square bg-white/5 rounded-lg animate-pulse" />
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                        <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
};
