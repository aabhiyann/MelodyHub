/**
 * ListenNowSection - Personalized "Listen Now" homepage
 * Apple Music inspired with Recently Played, Recommended
 */

import { AlbumCard } from '@/components/ui/AlbumCard';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { LikeButton } from '@/components/ui/LikeButton';
import { Play } from 'lucide-react';

export const ListenNowSection = () => {
    // Mock data - replace with real data
    const recentlyPlayed = [
        {
            id: '1',
            title: 'Midnight Dreams',
            artist: 'Luna Bay',
            imageUrl: 'https://picsum.photos/300/300?random=1',
        },
        {
            id: '2',
            title: 'Summer Vibes',
            artist: 'The Sunshine Crew',
            imageUrl: 'https://picsum.photos/300/300?random=2',
        },
        {
            id: '3',
            title: 'Neon Nights',
            artist: 'Cyber Dreams',
            imageUrl: 'https://picsum.photos/300/300?random=3',
        },
    ];

    const madeForYou = [
        {
            id: '1',
            title: 'Daily Mix 1',
            description: 'Indie Rock, Alternative',
            imageUrl: 'https://picsum.photos/300/300?random=4',
        },
        {
            id: '2',
            title: 'Discover Weekly',
            description: 'Your weekly mixtape of fresh music',
            imageUrl: 'https://picsum.photos/300/300?random=5',
        },
        {
            id: '3',
            title: 'Release Radar',
            description: 'New music from artists you follow',
            imageUrl: 'https://picsum.photos/300/300?random=6',
        },
    ];

    return (
        <div className="p-6 space-y-10">
            {/* Hero/Featured */}
            <LiquidGlassCard className="p-8 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                <div className="flex items-center gap-6">
                    <img
                        src="https://picsum.photos/200/200?random=hero"
                        alt="Featured"
                        className="size-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <p className="text-sm text-brand-primary font-semibold mb-2">
                            FEATURED PLAYLIST
                        </p>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Top Hits 2025
                        </h2>
                        <p className="text-text-secondary mb-4">
                            The biggest songs right now. Updated daily.
                        </p>
                        <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover rounded-lg font-semibold text-white transition-colors">
                            <Play className="size-5 fill-white" />
                            Play
                        </button>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Recently Played */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-4">Recently Played</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {recentlyPlayed.map((album) => (
                        <AlbumCard key={album.id} {...album} />
                    ))}
                </div>
            </section>

            {/* Made For You */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-4">Made For You</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {madeForYou.map((playlist) => (
                        <LiquidGlassCard key={playlist.id} className="p-4 group" hover>
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                <img
                                    src={playlist.imageUrl}
                                    alt={playlist.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button className="p-3 bg-brand-primary rounded-full hover:scale-110 transition-transform shadow-lg">
                                        <Play className="size-6 text-white fill-white ml-0.5" />
                                    </button>
                                    <LikeButton className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-white mb-1">{playlist.title}</h4>
                            <p className="text-sm text-text-secondary">{playlist.description}</p>
                        </LiquidGlassCard>
                    ))}
                </div>
            </section>
        </div>
    );
};
