import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load heavy components
const RightSidebar = lazy(() => import('@/components/layout/navigation/RightSidebar').then(m => ({ default: m.RightSidebar })));
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
                className="flex-1 min-w-0 overflow-y-auto focus:outline-none pb-32 md:pb-0"
                tabIndex={-1}
            >
                <Outlet />
            </main>

            {/* Right Sidebar (Desktop Only) */}
            {!isMobile && (
                <Suspense fallback={<div className="h-full w-[280px] shrink-0 animate-pulse bg-white/5 hidden xl:block z-30 border-l border-white/5" />}>
                    <RightSidebar />
                </Suspense>
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
