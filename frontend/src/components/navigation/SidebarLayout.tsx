/**
 * SidebarLayout - Layout wrapper with sidebar + main content
 * Responsive: sidebar on desktop, bottom tabs on mobile
 */

import { Sidebar } from './Sidebar';
import { BottomTabBar } from '@/components/mobile/BottomTabBar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';

export const SidebarLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className="h-screen flex">
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto ml-0 md:ml-[240px] pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Tabs */}
            {isMobile && <BottomTabBar />}
        </div>
    );
};
