/**
 * Loading skeletons for route-level code splitting
 * Optimized fallbacks while lazy-loaded components load
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Full page loading skeleton
 * Used for major route transitions
 */
export const PageLoadingSkeleton = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <Loader2 className="size-12 text-brand-primary animate-spin" />
                <p className="text-body-md text-gray-400">Loading...</p>
            </motion.div>
        </div>
    );
};

/**
 * Minimal loading skeleton
 * Used for smaller component splits
 */
export const MinimalLoadingSkeleton = () => {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 text-brand-primary animate-spin" />
        </div>
    );
};

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
