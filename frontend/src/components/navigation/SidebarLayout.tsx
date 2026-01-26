/**
 * SidebarLayout - Layout wrapper with sidebar + main content
 * Responsive: sidebar on desktop, bottom tabs on mobile
 */

import { Sidebar } from './Sidebar';
import { BottomTabBar } from '@/components/mobile/BottomTabBar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';

import { SkipLink } from '@/components/a11y/SkipLink';

export const SidebarLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className="h-screen flex">
            <SkipLink />
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}

            {/* Main Content Area */}
            <main id="main-content" className="flex-1 overflow-y-auto ml-0 md:ml-[240px] pb-24 md:pb-24 focus:outline-none" tabIndex={-1}>
                <Outlet />
            </main>

            {/* Mobile Bottom Tabs */}
            {isMobile && <BottomTabBar />}
        </div>
    );
};
