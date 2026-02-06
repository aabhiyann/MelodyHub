import { Sidebar } from './Sidebar';
import { BottomTabBar } from '@/components/features/mobile/BottomTabBar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';
import { Mascot } from '@/components/features/mascot/Mascot';
import { MascotOnboarding } from '@/components/features/mascot/MascotOnboarding';
import { FriendsActivity } from '@/components/features/social/FriendsActivity';

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
                    <FriendsActivity />
                </aside>
            )}

            {/* Mobile Bottom Tabs */}
            {isMobile && <BottomTabBar />}

            {/* Global Components */}
            <Mascot />
            <MascotOnboarding />
        </div>
    );
};
