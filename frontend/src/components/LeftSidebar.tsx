import PlaylistTab from "@/components/PlaylistTab";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useMusicStore } from "@/stores/MusicStore";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Home,
  Search,
  Library,
  MessageSquare,
  LockKeyholeOpen,
  Sparkles,
  Heart,
  ListMusic,
  Mic2,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { isAdmin } = useAuthStore();
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Helper to check if route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className='h-full flex flex-col gap-2'>
      {/* Main Navigation */}
      <div className='rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex flex-col p-3 shadow-sm'>
        <div className='space-y-1'>
          <Link
            to={'/home'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/home')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Home className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Home</span>
          </Link>

          {/* Browse */}
          <Link
            to={'/browse'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/browse')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Library className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Browse</span>
          </Link>

          {/* Radio */}
          <Link
            to={'/radio'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/radio')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Mic2 className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Radio</span>
          </Link>

          {/* Search - Placeholder for future */}
          <Link
            to={'/search'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/search')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Search className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Search</span>
          </Link>

          {/* Library - Placeholder for future */}
          <Link
            to={'/library'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/library')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Library className='mr-3 size-5 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline'>Your Library</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 my-3" />

        {/* AI Features */}
        <div className='space-y-1'>
          {user && (
            <>
              {/* AI Chat */}
              <Link
                to={'/ai'}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-full justify-start h-10 px-4 font-medium transition-all group',
                  isActiveRoute('/ai')
                    ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                <Sparkles className='mr-3 size-5 group-hover:scale-110 transition-transform text-brand-primary' />
                <span className='hidden md:inline'>Ask Melody</span>
              </Link>

              {/* Chat */}
              <Link
                to={'/chat'}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-full justify-start h-10 px-4 font-medium transition-all group',
                  isActiveRoute('/chat')
                    ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                <MessageSquare className='mr-3 size-5 group-hover:scale-110 transition-transform' />
                <span className='hidden md:inline'>Chat</span>
              </Link>
            </>
          )}

          {/* Admin Dashboard */}
          {isAdmin && user && (
            <>
              <div className="h-px bg-white/5 my-3" />
              <Link
                to={'/admin'}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-full justify-start h-10 px-4 font-medium transition-all group',
                  isActiveRoute('/admin')
                    ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                <LockKeyholeOpen className='mr-3 size-5 group-hover:scale-110 transition-transform' />
                <span className='hidden md:inline'>Admin</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Library/Collections Section */}
      <div className='flex-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex flex-col p-4 shadow-sm'>
        <div className='flex items-center justify-between mb-4 px-2'>
          <div className='flex items-center text-text-secondary group cursor-pointer hover:text-white transition-colors'>
            <Library className='size-5 mr-3 group-hover:scale-110 transition-transform' />
            <span className='hidden md:inline font-semibold tracking-tight'>Collections</span>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-420px)]'>
          <div className='space-y-1 p-1'>
            {/* Quick Links */}
            <div className="mb-4 space-y-1">
              <Link
                to={'/library?tab=liked'}
                className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all text-text-secondary hover:text-white'
              >
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-md">
                  <Heart className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm hidden md:inline'>Liked Songs</span>
              </Link>

              <Link
                to={'/library?tab=playlists'}
                className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all text-text-secondary hover:text-white'
              >
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-md">
                  <ListMusic className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm hidden md:inline'>Playlists</span>
              </Link>

              <Link
                to={'/library?tab=artists'}
                className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all text-text-secondary hover:text-white'
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-md">
                  <Mic2 className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm hidden md:inline'>Artists</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 my-3" />

            {/* Albums */}
            <p className="text-xs text-text-secondary font-semibold mb-2 px-2 hidden md:block">ALBUMS</p>
            {isLoading ? (
              <PlaylistTab />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className={cn(
                    'p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all',
                    isActiveRoute(`/albums/${album._id}`) ? 'bg-white/5' : ''
                  )}
                >
                  <img
                    src={album.imageUrl}
                    alt='Album'
                    className='size-10 rounded-md flex-shrink-0 object-cover shadow-sm group-hover:shadow-md transition-shadow'
                  />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium text-text-primary truncate text-sm'>{album.title}</p>
                    <p className='text-xs text-text-secondary truncate group-hover:text-text-primary transition-colors'>
                      {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className='rounded-xl bg-black/40 backdrop-blur-md border border-white/5 p-3 shadow-sm'>
          <div className='flex items-center gap-3'>
            <img
              src={user.imageUrl}
              alt={user.firstName || 'User'}
              className='size-10 rounded-full object-cover ring-2 ring-white/10'
            />
            <div className='flex-1 min-w-0 hidden md:block'>
              <p className='font-medium text-white text-sm truncate'>
                {user.firstName} {user.lastName}
              </p>
              <Link to="/profile" className='text-xs text-text-secondary hover:text-brand-primary transition-colors'>
                View Profile
              </Link>
            </div>
            <button
              onClick={() => signOut()}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors text-text-secondary hover:text-red-400 group'
              title="Sign Out"
            >
              <LogOut className='size-4 group-hover:scale-110 transition-transform' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
