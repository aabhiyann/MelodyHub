/**
 * DailyMixCard - Genre-based daily mix playlists
 * Spotify-inspired algorithmic playlists
 */

import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyMixCardProps {
    mixNumber: number;
    genre: string;
    coverImages: string[]; // 4 images for grid
    songCount: number;
}

export const DailyMixCard = ({ mixNumber, genre, coverImages, songCount }: DailyMixCardProps) => {
    return (
        <LiquidGlassCard className="p-4 group cursor-pointer" hover>
            {/* Cover Grid (2x2) */}
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-0.5">
                    {coverImages.slice(0, 4).map((image, i) => (
                        <div key={i} className="aspect-square bg-gray-800">
                            <img src={image} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Play overlay */}
                <motion.div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                >
                    <button className="p-4 bg-brand-primary rounded-full shadow-lg hover:scale-105 transition-transform">
                        <Play className="size-6 text-white fill-white" />
                    </button>
                </motion.div>

                {/* Mix number badge */}
                <div className="absolute top-2 right-2 size-8 bg-brand-primary rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {mixNumber}
                </div>
            </div>

            {/* Info */}
            <h4 className="font-semibold text-white mb-1">Daily Mix {mixNumber}</h4>
            <p className="text-sm text-text-secondary mb-1">{genre}</p>
            <p className="text-xs text-text-tertiary">{songCount} songs</p>
        </LiquidGlassCard>
    );
};
