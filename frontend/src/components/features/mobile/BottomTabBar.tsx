/**
 * BottomTabBar - Mobile bottom navigation
 * 4 quick actions: Music, Explore, Chat, Profile. Always visible; active/inactive accent states.
 */

import { Home, Search, Library, MessageSquare, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
    icon: typeof Home;
    path: string;
}

const tabs: Tab[] = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export const BottomTabBar = () => {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom border-t border-white/10"
            style={{
                paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}
        >
            <div className="flex justify-around items-center h-14 px-2">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.path}
                        className={() =>
                            cn(
                                'flex flex-col items-center justify-center gap-0.5',
                                'min-w-[56px] min-h-[44px] flex-1',
                                'transition-colors duration-200',
                                'relative'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                >
                                    <tab.icon
                                        className={cn(
                                            'size-6 transition-colors duration-200',
                                            isActive ? 'text-[#22C55E]' : 'text-white/50'
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </motion.div>
                                <span
                                    className={cn(
                                        'text-[11px] font-medium transition-colors duration-200',
                                        isActive ? 'text-[#22C55E]' : 'text-white/50'
                                    )}
                                >
                                    {tab.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

