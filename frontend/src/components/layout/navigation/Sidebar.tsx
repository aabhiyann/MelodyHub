/**
 * Sidebar - Web nav aligned with mobile bottom bar (Music, Explore, Chat, Profile).
 * Glassmorphism background; primary items match mobile; active state with accent.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    Music2,
    Compass,
    Radio,
    Library,
    Search,
    ListMusic,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    User,
    TrendingUp,
    Users,
    Target,
    Settings,
    Shield,
    Sparkles,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/AuthStore';
import { usePlaylistStore } from '@/stores/PlaylistStore';
import { useAIStore } from '@/stores/useAIStore';

interface NavItem {
    id: string;
    label: string;
    icon: typeof Music2;
    path: string;
}

const primaryNavItems: NavItem[] = [
    { id: 'music', label: 'Music', icon: Music2, path: '/home' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/browse' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

const secondaryNavItems: NavItem[] = [
    { id: 'radio', label: 'Radio', icon: Radio, path: '/radio' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'analytics', label: 'My Stats', icon: TrendingUp, path: '/analytics' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    { id: 'quests', label: 'Quests', icon: Target, path: '/quests' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

interface SidebarProps {
    className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { isAdmin } = useAuthStore();
    const { userPlaylists, fetchUserPlaylists } = usePlaylistStore();
    const { openModal: openAIModal } = useAIStore();

    useEffect(() => {
        fetchUserPlaylists();
    }, [fetchUserPlaylists]);

    const navLinkClass = (isActive: boolean) =>
        cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'transition-all duration-200',
            'group relative',
            isActive
                ? 'bg-[#111827] text-[#22C55E]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
        );

    return (
        <motion.aside
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300',
                className
            )}
            style={{
                background: 'rgba(16,16,22,0.94)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
            animate={{
                width: isExpanded ? 240 : 80,
            }}
        >
            {/* Logo & Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] shrink-0 min-h-[56px]">
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Link to="/home" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                                <img
                                    src="/mascot/melody-icon.png"
                                    alt="MelodyHub"
                                    className="size-8 rounded-full object-cover"
                                />
                                <span className="font-display font-bold text-lg tracking-tight text-[#F9FAFB]">
                                    MelodyHub
                                </span>
                            </Link>
                        </motion.div>
                    ) : (
                        <Link to="/home" className="flex items-center justify-center p-1 hover:opacity-90 transition-opacity" aria-label="MelodyHub">
                            <img src="/mascot/melody-icon.png" alt="" className="size-8 rounded-full object-cover" />
                        </Link>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 h-8 w-8 min-h-0 min-w-0 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors text-[#9CA3AF] hover:text-[#F9FAFB]"
                    aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isExpanded ? (
                        <ChevronLeft className="size-5" />
                    ) : (
                        <ChevronRight className="size-5" />
                    )}
                </button>
            </div>

            {/* Main Navigation - primary (match mobile) then secondary */}
            <nav className="flex-1 overflow-y-auto p-3">
                <div className="space-y-0.5">
                    {primaryNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => navLinkClass(isActive)}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#22C55E] rounded-r"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="size-5 shrink-0" />
                                    <AnimatePresence mode="wait">
                                        {isExpanded && (
                                            <motion.span
                                                className="font-medium truncate"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="my-2 border-t border-white/[0.08]" />

                <div className="space-y-0.5 mb-2">
                    <button
                        type="button"
                        onClick={openAIModal}
                        title="AI Playlist Generator — describe your vibe, get a custom playlist"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200',
                            'text-[#22C55E] hover:bg-[#22C55E]/10 hover:text-[#22C55E]'
                        )}
                        aria-label="AI Playlist Generator"
                    >
                        <Sparkles className="size-5 shrink-0" />
                        {isExpanded && (
                            <span className="font-medium truncate">Magic</span>
                        )}
                    </button>
                </div>

                <div className="space-y-0.5">
                    {secondaryNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            title={
                                item.id === 'quests'
                                    ? 'Complete daily challenges to earn badges and XP'
                                    : item.label
                            }
                            className={({ isActive }) => navLinkClass(isActive)}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#22C55E] rounded-r"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="size-5 shrink-0" />
                                    <AnimatePresence mode="wait">
                                        {isExpanded && (
                                            <motion.span
                                                className="font-medium truncate"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Admin Link - Only visible for admin users */}
                {isAdmin && (
                    <div className="mt-2">
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => navLinkClass(isActive)}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#22C55E] rounded-r"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Shield className="size-5 shrink-0" />
                                    <AnimatePresence mode="wait">
                                        {isExpanded && (
                                            <motion.span
                                                className="font-medium truncate"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Admin
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    </div>
                )}


                {/* Playlists Section */}
                {isExpanded && (
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                            Playlists
                        </h3>

                        <div className="space-y-1">
                            {userPlaylists.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-text-tertiary italic">No playlists yet</p>
                            ) : (
                                userPlaylists.map((playlist) => (
                                    <NavLink
                                        key={playlist._id}
                                        to={`/playlists/${playlist._id}`}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-lg',
                                                'transition-colors',
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                            )
                                        }
                                    >
                                        <ListMusic className="size-4 shrink-0" />
                                        <span className="text-sm truncate">{playlist.name}</span>
                                    </NavLink>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </nav>


        </motion.aside>
    );
};
