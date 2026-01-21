/**
 * SearchPage - Spotify-inspired search interface
 * Features: Large search bar, browse genres, recent searches, search results
 */

import { useState } from 'react';
import { Search as SearchIcon, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';

const GENRES = [
    { name: 'Pop', color: 'from-pink-500 to-rose-500', emoji: '🎤' },
    { name: 'Rock', color: 'from-red-500 to-orange-500', emoji: '🎸' },
    { name: 'Hip Hop', color: 'from-purple-500 to-indigo-500', emoji: '🎵' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', emoji: '⚡' },
    { name: 'Jazz', color: 'from-amber-500 to-yellow-500', emoji: '🎷' },
    { name: 'Classical', color: 'from-violet-500 to-purple-500', emoji: '🎻' },
    { name: 'R&B', color: 'from-pink-600 to-purple-600', emoji: '💫' },
    { name: 'Country', color: 'from-orange-500 to-red-500', emoji: '🤠' },
    { name: 'Latin', color: 'from-red-500 to-pink-500', emoji: '💃' },
    { name: 'Indie', color: 'from-teal-500 to-green-500', emoji: '🌟' },
    { name: 'Metal', color: 'from-gray-600 to-black', emoji: '🎭' },
    { name: 'Folk', color: 'from-green-600 to-emerald-600', emoji: '🌲' },
];

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches] = useState([
        'chill vibes',
        'workout music',
        'jazz classics',
    ]);

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-8'>
                    {/* Search Input */}
                    <div className='max-w-3xl'>
                        <div className='relative'>
                            <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400' />
                            <input
                                type='text'
                                placeholder='What do you want to listen to?'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full h-14 pl-12 pr-4 rounded-full bg-white/10 border-2 border-white/10 focus:border-white/30 text-white placeholder-zinc-400 text-base transition-all focus:ring-4 focus:ring-brand-primary/20 outline-none'
                            />
                        </div>
                    </div>

                    {/* Empty State - Browse All */}
                    {!searchQuery && (
                        <>
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <h2 className='text-2xl font-bold text-white mb-4'>Recent Searches</h2>
                                    <div className='space-y-2'>
                                        {recentSearches.map((search, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSearchQuery(search)}
                                                className='flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left group'
                                            >
                                                <div className='p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors'>
                                                    <Clock className='size-5 text-zinc-400' />
                                                </div>
                                                <span className='text-white font-medium'>{search}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Browse All */}
                            <div>
                                <h2 className='text-2xl font-bold text-white mb-4'>Browse All</h2>
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                    {GENRES.map((genre) => (
                                        <button
                                            key={genre.name}
                                            className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br ${genre.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group`}
                                        >
                                            <div className='absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors' />
                                            <div className='relative h-full p-4 flex flex-col justify-between'>
                                                <h3 className='text-xl font-bold text-white drop-shadow-lg'>
                                                    {genre.name}
                                                </h3>
                                                <div className='text-4xl opacity-80 group-hover:opacity-100 transition-opacity self-end transform rotate-12'>
                                                    {genre.emoji}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Search Results */}
                    {searchQuery && (
                        <div>
                            <p className='text-zinc-400 mb-6'>
                                Showing results for "<span className='text-white font-semibold'>{searchQuery}</span>"
                            </p>

                            {/* Placeholder for search results */}
                            <div className='text-center py-12'>
                                <SearchIcon className='size-16 text-zinc-600 mx-auto mb-4' />
                                <p className='text-zinc-400 text-lg'>
                                    Search functionality coming soon!
                                </p>
                                <p className='text-zinc-500 text-sm mt-2'>
                                    This will integrate with your music backend API
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </main>
    );
};

export default SearchPage;
