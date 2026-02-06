import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load heavy components
const FriendsActivity = lazy(() => import('@/components/features/social/FriendsActivity').then(m => ({ default: m.FriendsActivity })));
const BottomTabBar = lazy(() => import('@/components/features/mobile/BottomTabBar').then(m => ({ default: m.BottomTabBar })));

export const SidebarLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className="h-screen flex bg-surface-base text-text-primary font-sans antialiased selection:bg-brand-primary/30">
            {/* Desktop Sidebar (Left) */}
            {!isMobile && (
                <aside className="w-[240px] shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-xl z-30">
                    <Sidebar />
                </aside>
            )}

            {/* Main Content Area */}
            <main
                id="main-content"
                className="flex-1 min-w-0 overflow-y-auto focus:outline-none"
                tabIndex={-1}
            >
                <Outlet />

                {/* Spacer for bottom tab bar on mobile */}
                {isMobile && <div className="h-24" />}
            </main>

            {/* Friends Activity Sidebar (Right) - Desktop Only */}
            {!isMobile && (
                <aside className="hidden xl:block w-[280px] shrink-0 border-l border-white/5 bg-black/20 backdrop-blur-xl z-30">
                    <Suspense fallback={<div className="h-full w-full animate-pulse bg-white/5" />}>
                        <FriendsActivity />
                    </Suspense>
                </aside>
            )}

            {/* Mobile Bottom Tabs */}
            {isMobile && (
                <Suspense fallback={null}>
                    <BottomTabBar />
                </Suspense>
            )}
        </div>
    );
};
