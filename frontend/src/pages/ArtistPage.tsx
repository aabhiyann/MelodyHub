/**
 * ArtistPage - Artist profile page
 * Features: Artist info, top tracks, albums (placeholder)
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { Music, Play, Heart, Users } from 'lucide-react';

const ArtistPage = () => {
    // Placeholder - replace with real artist data
    const artistName = "Sample Artist";

    return (
        <main className='rounded-md relative overflow-hidden h-full bg-transparent'>
            {/* Blurred Background */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-b from-purple-600/30 via-black/60 to-black' />
            </div>

            {/* Content */}
            <div className='relative z-10'>
                <Topbar />
                <ScrollArea className='h-[calc(100vh-180px)]'>
                    <div className='p-6 space-y-8'>
                        {/* Artist Header */}
                        <div className='flex flex-col md:flex-row items-center gap-6'>
                            <div className='size-48 rounded-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-2xl'>
                                <Music className='size-24 text-white' />
                            </div>

                            <div className='flex-1 text-center md:text-left'>
                                <p className='text-sm text-zinc-400 uppercase tracking-wider mb-2'>Artist</p>
                                <h1 className='text-5xl md:text-7xl font-bold text-white mb-4'>{artistName}</h1>
                                <div className='flex items-center gap-4 justify-center md:justify-start text-zinc-300'>
                                    <div className='flex items-center gap-2'>
                                        <Users className='size-4' />
                                        <span>1.2M followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-4'>
                            <button className='flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold transition-all hover:scale-105 shadow-lg'>
                                <Play className='size-5' />
                                <span>Play</span>
                            </button>
                            <button className='p-3 rounded-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all'>
                                <Heart className='size-6 text-white' />
                            </button>
                        </div>

                        {/* Content Sections */}
                        <div className='space-y-8'>
                            {/* Top Tracks */}
                            <div>
                                <h2 className='text-2xl font-bold text-white mb-4'>Popular Tracks</h2>
                                <div className='text-center py-12 rounded-xl bg-white/5 border border-white/10'>
                                    <Music className='size-12 text-zinc-600 mx-auto mb-4' />
                                    <p className='text-zinc-400 text-lg'>Coming Soon!</p>
                                    <p className='text-zinc-500 text-sm mt-2'>
                                        Artist pages with top tracks and albums
                                    </p>
                                </div>
                            </div>

                            {/* Albums */}
                            <div>
                                <h2 className='text-2xl font-bold text-white mb-4'>Discography</h2>
                                <div className='text-center py-12 rounded-xl bg-white/5 border border-white/10'>
                                    <Music className='size-12 text-zinc-600 mx-auto mb-4' />
                                    <p className='text-zinc-400 text-lg'>Albums coming soon!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};

export default ArtistPage;
