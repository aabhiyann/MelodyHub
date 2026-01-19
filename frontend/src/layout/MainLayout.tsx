import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";

import { useEffect, useState } from "react";

import LeftSidebar from "@/components/LeftSidebar";
import ActivitySidebar from "@/components/ActivitySidebar";
import AudioPlayer from "@/components/AudioPlayer";

import PlaybackControls from "@/components/PlaybackControls";
const MainLayout = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className='h-screen bg-black text-white flex flex-col'>
            {/* Skip to main content link for keyboard users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--melody-purple-600)] focus:text-white focus:rounded-md"
            >
                Skip to main content
            </a>

            <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
                <AudioPlayer />
                {/* left sidebar */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                    <LeftSidebar />
                </ResizablePanel>

                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                {/* Main content */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <main id="main-content" role="main" aria-label="Main content">
                        <Outlet />
                    </main>
                </ResizablePanel>

                {/* {!isMobile && (
                    <> */}
                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                {/* right sidebar */}
                <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                    <ActivitySidebar />
                </ResizablePanel>
                {/* </> */}

            </ResizablePanelGroup>

            <PlaybackControls />
        </div>
    );
};
export default MainLayout;

