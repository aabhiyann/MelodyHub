/**
 * LibraryPage - User's music collection
 * Features: Tabs for Playlists/Artists/Albums/Liked, Filter controls, Grid/List view
 */

import { useState } from 'react';
import { Heart, ListMusic, Mic2, Disc3, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { useMusicStore } from '@/stores/MusicStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type TabType = 'playlists' | 'artists' | 'albums' | 'liked';
type ViewType = 'grid' | 'list';

const LibraryPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('playlists');
    const [viewType, setViewType] = useState<ViewType>('grid');
    const { albums } = useMusicStore();

    const tabs = [
        { id: 'playlists', label: 'Playlists', icon: ListMusic },
        { id: 'artists', label: 'Artists', icon: Mic2 },
        { id: 'albums', label: 'Albums', icon: Disc3 },
        { id: 'liked', label: 'Liked Songs', icon: Heart },
    ];

    return (
        <main className='rounded-md overflow-hidden h-full bg-transparent'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-6 space-y-6'>
                    {/* Header */}
                    <div>
                        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>Your Library</h1>
                        <p className='text-zinc-400'>All your music in one place</p>
                    </div>

                    {/* Tabs */}
                    <div className='flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2'>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                                        activeTab === tab.id
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    <Icon className='size-4' />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors'>
                                <SlidersHorizontal className='size-4' />
                                <span className='hidden md:inline'>Filter</span>
                            </button>
                        </div>

                        {/* View Toggle */}
                        <div className='flex items-center gap-1 bg-white/5 rounded-lg p-1'>
                            <button
                                onClick={() => setViewType('grid')}
                                className={cn(
                                    'p-2 rounded-md transition-colors',
                                    viewType === 'grid'
                                        ? 'bg-white/20 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                )}
                            >
                                <Grid3x3 className='size-4' />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={cn(
                                    'p-2 rounded-md transition-colors',
                                    viewType === 'list'
                                        ? 'bg-white/20 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                )}
                            >
                                <List className='size-4' />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {/* Albums Tab */}
                        {activeTab === 'albums' && (
                            <>
                                {viewType === 'grid' ? (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                                        {albums.map((album) => (
                                            <Link
                                                key={album._id}
                                                to={`/albums/${album._id}`}
                                                className='group space-y-3'
                                            >
                                                <div className='relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow'>
                                                    <img
                                                        src={album.imageUrl}
                                                        alt={album.title}
                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                    />
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-white truncate'>{album.title}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        {albums.map((album) => (
                                            <Link
                                                key={album._id}
                                                to={`/albums/${album._id}`}
                                                className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group'
                                            >
                                                <img
                                                    src={album.imageUrl}
                                                    alt={album.title}
                                                    className='size-14 rounded-md object-cover'
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-semibold text-white truncate'>{album.title}</p>
                                                    <p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Placeholder for other tabs */}
                        {activeTab !== 'albums' && (
                            <div className='text-center py-16'>
                                <div className='inline-flex items-center justify-center size-20 rounded-full bg-white/10 mb-4'>
                                    {activeTab === 'playlists' && <ListMusic className='size-10 text-zinc-400' />}
                                    {activeTab === 'artists' && <Mic2 className='size-10 text-zinc-400' />}
                                    {activeTab === 'liked' && <Heart className='size-10 text-zinc-400' />}
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    {activeTab === 'playlists' && 'No Playlists Yet'}
                                    {activeTab === 'artists' && 'No Artists Followed'}
                                    {activeTab === 'liked' && 'No Liked Songs'}
                                </h3>
                                <p className='text-zinc-400'>
                                    {activeTab === 'playlists' && 'Create your first playlist to see it here'}
                                    {activeTab === 'artists' && 'Follow artists to see them here'}
                                    {activeTab === 'liked' && 'Like songs to build your collection'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};

export default LibraryPage;
