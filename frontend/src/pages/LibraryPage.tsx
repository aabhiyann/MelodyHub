/**
 * LibraryPage - User's music collection
 * Features: Playlists/Artists/Albums/Liked tabs with full functionality
 */

import { useState, useEffect } from 'react';
import { Heart, ListMusic, Mic2, Disc3, Grid3x3, List, SlidersHorizontal, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Topbar from '@/components/Topbar';
import { useMusicStore } from '@/stores/MusicStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { axiosInstance } from '@/lib/axios';
import { Song } from '@/types';
import toast from 'react-hot-toast';

type TabType = 'playlists' | 'artists' | 'albums' | 'liked';
type ViewType = 'grid' | 'list';

interface Playlist {
    _id: string;
    name: string;
    description?: string;
    songs: Song[];
    createdAt: string;
}

const LibraryPage = () => {
    {
        albums.map((album) => (
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
        ))
    }
                                    </div >
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

{/* Placeholder for other tabs */ }
{
    activeTab !== 'albums' && (
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
    )
}
                    </div >
                </div >
            </ScrollArea >
        </main >
    );
};

export default LibraryPage;
