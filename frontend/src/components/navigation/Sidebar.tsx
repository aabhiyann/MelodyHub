/**
 * Sidebar - Apple Music inspired navigation sidebar
 * Collapsible with Listen Now, Browse, Radio, Library, Search
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Compass,
    Radio,
    Library,
    Search,
    Heart,
    ListMusic,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    User,
    TrendingUp,
    Users,
    Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
import { useAIStore } from '@/stores/useAIStore';

interface NavItem {
    id: string;
    label: string;
    icon: typeof Home;
    path: string;
}

const mainNavItems: NavItem[] = [
    { id: 'listen-now', label: 'Listen Now', icon: Home, path: '/home' },
    { id: 'browse', label: 'Browse', icon: Compass, path: '/browse' },
    { id: 'radio', label: 'Radio', icon: Radio, path: '/radio' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
];

interface SidebarProps {
    className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { openModal } = useAIStore();
    const [playlists] = useState([
        { id: '1', name: 'Liked Songs', icon: Heart },
        { id: '2', name: 'My Playlist #1', icon: ListMusic },
        { id: '3', name: 'Chill Vibes', icon: ListMusic },
        { id: '4', name: 'Workout Mix', icon: ListMusic },
    ]);

    return (
        <motion.aside
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40',
                'flex flex-col',
                'glass-panel border-r border-y-0 border-l-0 rounded-none',
                'transition-all duration-300',
                className
            )}
            animate={{
                width: isExpanded ? 240 : 80,
            }}
        >
            {/* Logo & Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.h1
                            className="text-xl font-bold text-brand-primary tracking-tight"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            MelodyHub
                        </motion.h1>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 h-8 w-8 min-h-0 min-w-0 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
                    aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isExpanded ? (
                        <ChevronLeft className="size-5 text-text-secondary" />
                    ) : (
                        <ChevronRight className="size-5 text-text-secondary" />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {mainNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                    'transition-all duration-200',
                                    'group relative',
                                    isActive
                                        ? 'bg-white/10 text-[var(--brand-primary)]'
                                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r"
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

                {/* AI Generator Button - Special Feature */}
                <div className="mt-4 px-2">
                    <button
                        onClick={openModal}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                            'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10',
                            'border border-brand-primary/20',
                            'hover:from-brand-primary/20 hover:to-brand-secondary/20',
                            'transition-all duration-300 group',
                            !isExpanded && 'justify-center px-0'
                        )}
                    >
                        <Sparkles className="size-5 text-brand-primary shrink-0 group-hover:animate-pulse" />

                        <AnimatePresence mode="wait">
                            {isExpanded && (
                                <motion.span
                                    className="font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent truncate"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    AI Generator
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

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
                            {playlists.map((playlist) => {
                                const PlaylistIcon = playlist.icon;
                                return (
                                    <NavLink
                                        key={playlist.id}
                                        to={`/playlists/${playlist.id}`}
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
                                        <PlaylistIcon className="size-4 shrink-0" />
                                        <span className="text-sm truncate">{playlist.name}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* Mini Player Placeholder */}
            <div className="p-3 border-t border-white/10">
                <LiquidGlassCard className="p-2">
                    {isExpanded ? (
                        <div className="flex items-center gap-2">
                            <div className="size-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">Song Title</p>
                                <p className="text-xs text-text-tertiary truncate">Artist</p>
                            </div>
                        </div>
                    ) : (
                        <div className="size-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded mx-auto" />
                    )}
                </LiquidGlassCard>
            </div>
        </motion.aside>
    );
};
