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
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import AIPlaylistDialog from "./AIPlaylistDialog";

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
      <div className='rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex flex-col p-3 shadow-sm'>
        <div className='space-y-1'>
          {/* Home */}
          <Link
            to={'/home'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start text-text-secondary hover:text-white hover:bg-white/10 h-10 px-4 font-medium transition-all group',
              })
            )}
          >
            <Music2 className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Home</span>
          </Link>

          {/* Ask Melody AI */}
          {user && (
            <Link
              to={'/ai'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'w-full justify-start text-text-secondary hover:text-white hover:bg-white/10 h-10 px-4 font-medium transition-all group',
                })
              )}
            >
              <Sparkles className='mr-3 size-5 group-hover:scale-110 transition-transform text-brand-primary' />
              <span className='hidden md:inline'>Ask Melody</span>
            </Link>
          )}

          {/* AI Playlist - Only if logged in */}
          {user && (
            <div className="hidden md:block">
              <AIPlaylistDialog />
            </div>
          )}

          {/* Chat */}
          {user ? (
            <Link
              to={'/chat'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'w-full justify-start text-text-secondary hover:text-white hover:bg-white/10 h-10 px-4 font-medium transition-all group',
                })
              )}
            >
              <MessageSquare className='mr-3 size-5 group-hover:scale-110 transition-transform' />
              <span className='hidden md:inline'>Chat</span>
            </Link>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-text-disabled cursor-not-allowed h-10 px-4',
                })
              )}
            >
              <MessageSquare className='mr-3 size-5' />
              <span className='hidden md:inline'>Chat</span>
            </div>
          )}

          {/* Admin Dashboard */}
          {isAdmin && user ? (
            <Link
              to={'/admin'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: 'w-full justify-start text-text-secondary hover:text-white hover:bg-white/10 h-10 px-4 font-medium transition-all group',
                })
              )}
            >
              <LockKeyholeOpen className='mr-3 size-5 group-hover:scale-110 transition-transform' />
              <span className='hidden md:inline'>Admin</span>
            </Link>
          ) : (
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-text-disabled cursor-not-allowed hidden',
                })
              )}
            >
              <LockKeyhole className='mr-3 size-5' />
              <span className='hidden md:inline'>Admin</span>
            </div>
          )}

        </div>
      </div>

      {/* Library Section */}
      <div className='flex-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex flex-col p-4 shadow-sm'>
        <div className='flex items-center justify-between mb-4 px-2'>
          <div className='flex items-center text-text-secondary group cursor-pointer hover:text-white transition-colors'>
            <Library className='size-5 mr-3 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline font-semibold tracking-tight'>Your Library</span>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-340px)]'>
          <div className='space-y-1 p-1'>
            {isLoading ? (
              <PlaylistTab />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all'
                >
                  <img
                    src={album.imageUrl}
                    alt='Playlist img'
                    className='size-10 rounded-md flex-shrink-0 object-cover shadow-sm group-hover:shadow-md transition-shadow'
                  />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium text-text-primary truncate text-sm'>{album.title}</p>
                    <p className='text-xs text-text-secondary truncate group-hover:text-text-primary transition-colors'>
                      Album <span className="inline-block w-1 h-1 rounded-full bg-zinc-600 mx-1" /> {album.artist}
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
