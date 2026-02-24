/**
 * BottomTabBar - Mobile navigation
 * Native app-like bottom navigation with 4 tabs
 */

import { Home, Compass, MessageSquare, Library, Search } from 'lucide-react';
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
    { id: 'browse', label: 'Browse', icon: Compass, path: '/browse' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' },
];

export const BottomTabBar = () => {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-white/10 safe-area-bottom"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <div className="flex justify-around items-center h-16 px-2">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.path}
                        className={() =>
                            cn(
                                'flex flex-col items-center justify-center',
                                'min-w-[48px] min-h-[48px] flex-1',
                                'transition-colors duration-200',
                                'relative'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <tab.icon
                                    className={cn(
                                        'size-6 mb-1 transition-colors',
                                        isActive ? 'text-brand-primary' : 'text-gray-400'
                                    )}
                                />
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-colors',
                                        isActive ? 'text-brand-primary' : 'text-gray-400'
                                    )}
                                >
                                    {tab.label}
                                </span>

                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-primary rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
