/**
 * SidebarLayout - Layout wrapper with sidebar + main content
 * Responsive: sidebar on desktop, bottom tabs on mobile
 */

import { Sidebar } from './Sidebar';
import { BottomTabBar } from '@/components/mobile/BottomTabBar';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { SkipLink } from '@/components/a11y/SkipLink';
import { Mascot } from '@/components/mascot/Mascot';
import { MascotOnboarding } from '@/components/mascot/MascotOnboarding';
import { Toaster } from 'react-hot-toast';

export const SidebarLayout = () => {
    const isMobile = useIsMobile();

    return (
        <div className="h-screen flex">
            <SkipLink />
            {/* Desktop Sidebar - Visible on Tablet+ (sm breakpoint) */}
            {!isMobile && <Sidebar />}

            {/* Main Content Area */}
            <main
                id="main-content"
                className={cn(
                    "flex-1 overflow-y-auto pb-24 focus:outline-none",
                    // Mobile: No margin
                    "ml-0",
                    // Tablet/Desktop: Sidebar width margin
                    // Note: Sidebar is 240px by default. 
                    // TODO: Lift isExpanded state to match collapsed width (80px)
                    "sm:ml-[240px]"
                )}
                tabIndex={-1}
            >
                <Outlet />
            </main>

            {/* Mobile Bottom Tabs */}
            {isMobile && <BottomTabBar />}

            {/* Global Components */}
            <Mascot />
            <MascotOnboarding />
            <Toaster position="top-center" />
        </div>
    );
};
