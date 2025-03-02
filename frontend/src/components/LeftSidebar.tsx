import PlaylistTab from "@/components/PlaylistTab";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useMusicStore } from "@/stores/MusicStore";
import { useUser } from "@clerk/clerk-react";
import {
  Music2,
  Library,
  MessageSquare,
  LockKeyholeOpen,
  LockKeyhole,
  
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { isAdmin } = useAuthStore();
  const { user } = useUser();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className='h-full flex flex-col gap-2'>
      {/* Navigation Menu */}
      <div className='h-full bg-purple-950 rounded-lg flex flex-col p-4'>
        <div className='space-y-2'>
          {/* Home */}
          <Link
            to={'/'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start text-white hover:bg-zinc-500',
              })
            )}
          >
            <Music2 className='mr-2 size-6' />
            <span className='hidden md:inline'>Home</span>
          </Link>

          {/* Chat (clickable only if logged in) */}
          {user ? (
            <Link
              to={'/chat'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'w-full justify-start text-white hover:bg-zinc-500',
                })
              )}
            >
              <MessageSquare className='mr-2 size-6 text-emerald-500' />
              <span className='hidden md:inline'>Chat</span>
            </Link>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-white opacity-70 cursor-not-allowed',
                })
              )}
            >
              <MessageSquare className='mr-2 size-6 text-red-500' />
              <span className='hidden md:inline'>Chat (Login Required)</span>
            </div>
          )}

          {/* Admin Dashboard */}
          {isAdmin && user ? (
            <Link
              to={'/admin'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'w-full justify-start text-white hover:bg-zinc-500',
                })
              )}
            >
              <LockKeyholeOpen className='mr-2 size-6 text-emerald-500' />
              <span className='hidden md:inline'>Admin Dashboard</span>
            </Link>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-white opacity-70 cursor-not-allowed',
                })
              )}
            >
              <LockKeyhole className='mr-2 size-6 text-red-500' />
              <span className='hidden md:inline'>Admin (Restricted)</span>
            </div>
          )}

         

        </div>
      </div>

      {/* Library Section */}
      <div className='h-full bg-purple-950 rounded-lg flex flex-col p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='size-5 mr-2' />
            <span className='hidden md:inline'>Albums</span>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-300px)]'>
          <div className='space-y-2'>
            {isLoading ? (
              <PlaylistTab />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className='p-2 hover:bg-zinc-500 rounded-md flex items-center gap-3 group cursor-pointer'
                >
                  <img
                    src={album.imageUrl}
                    alt='Playlist img'
                    className='size-12 rounded-md flex-shrink-0 object-cover'
                  />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium truncate'>{album.title}</p>
                    <p className='text-sm text-zinc-400 truncate'>
                      Album by  {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
