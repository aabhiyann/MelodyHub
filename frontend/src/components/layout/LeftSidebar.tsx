import PlaylistTab from "@/components/features/playlist/PlaylistTab";
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
  Target
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
      <div className='rounded-xl glass-panel flex flex-col p-3 shadow-sm'>
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
            <Home className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/home') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/home') ? 2.5 : 2} />
            <span className='inline'>Home</span>
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
            <Library className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/browse') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/browse') ? 2.5 : 2} />
            <span className='inline'>Browse</span>
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
            <Mic2 className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/radio') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/radio') ? 2.5 : 2} />
            <span className='inline'>Radio</span>
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
            <Search className='mr-3 size-5 group-hover:scale-110 transition-transform' strokeWidth={isActiveRoute('/search') ? 2.5 : 2} />
            <span className='inline'>Search</span>
          </Link>

          <Link
            to={'/quests'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'w-full justify-start h-10 px-4 font-medium transition-all group',
              isActiveRoute('/quests')
                ? 'bg-white/10 text-white border-l-4 border-brand-primary'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <Target className='mr-3 size-5 group-hover:scale-110 transition-transform text-yellow-500' fill={isActiveRoute('/quests') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/quests') ? 2.5 : 2} />
            <span className='inline'>Quests</span>
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
            <Library className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/library') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/library') ? 2.5 : 2} />
            <span className='inline'>Your Library</span>
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
                <Sparkles className='mr-3 size-5 group-hover:scale-110 transition-transform text-brand-primary' fill={isActiveRoute('/ai') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/ai') ? 2.5 : 2} />
                <span className='inline'>Ask Melody</span>
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
                <MessageSquare className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/chat') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/chat') ? 2.5 : 2} />
                <span className='inline'>Chat</span>
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
                <LockKeyholeOpen className='mr-3 size-5 group-hover:scale-110 transition-transform' fill={isActiveRoute('/admin') ? "currentColor" : "none"} strokeWidth={isActiveRoute('/admin') ? 2.5 : 2} />
                <span className='inline'>Admin</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Library/Collections Section */}
      <div className='flex-1 rounded-xl glass-panel flex flex-col p-4 shadow-sm'>
        <div className='flex items-center justify-between mb-4 px-2'>
          <div className='flex items-center text-text-secondary group cursor-pointer hover:text-white transition-colors'>
            <Library className='size-5 mr-3 group-hover:scale-110 transition-transform' />
            <span className='inline font-semibold tracking-tight'>Collections</span>
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
                <span className='font-medium text-sm inline'>Liked Songs</span>
              </Link>

              <Link
                to={'/library?tab=playlists'}
                className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all text-text-secondary hover:text-white'
              >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-md">
                  <ListMusic className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm inline'>Playlists</span>
              </Link>

              <Link
                to={'/library?tab=artists'}
                className='p-2 hover:bg-white/10 rounded-lg flex items-center gap-3 group cursor-pointer transition-all text-text-secondary hover:text-white'
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-md">
                  <Mic2 className='size-4 text-white' />
                </div>
                <span className='font-medium text-sm inline'>Artists</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 my-3" />

            {/* Albums */}
            <p className="text-xs text-text-secondary font-semibold mb-2 px-2 hidden md:block uppercase tracking-wider">Albums</p>
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
                  <div className='flex-1 min-w-0 block'>
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
        <div className='rounded-xl bg-black/60 backdrop-blur-3xl border border-white/5 p-3 shadow-sm'>
          <div className='flex items-center gap-3'>
            <img
              src={user.imageUrl}
              alt={user.firstName || 'User'}
              className='size-10 rounded-full object-cover ring-2 ring-white/10'
            />
            <div className='flex-1 min-w-0 block'>
              <p className='font-medium text-white text-sm truncate'>
                {user.firstName} {user.lastName}
              </p>
              <Link to="/profile" className='text-xs text-text-secondary hover:text-brand-primary transition-colors'>
                View Profile
              </Link>
            </div>
            <button
              onClick={() => signOut()}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors text-text-secondary hover:text-error group'
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
