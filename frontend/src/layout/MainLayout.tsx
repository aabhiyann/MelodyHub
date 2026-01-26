import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState } from "react";

import LeftSidebar from "@/components/LeftSidebar";
import ActivitySidebar from "@/components/ActivitySidebar";
import AudioPlayer from "@/components/AudioPlayer";
import PlaybackControls from "@/components/PlaybackControls";
import QueueView from "@/components/QueueView";
import LyricsView from "@/components/LyricsView";
import { usePlayerStore } from "@/stores/PlayerStore";

const MainLayout = () => {

    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const { isQueueOpen } = usePlayerStore();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className='h-screen bg-background-base text-text-primary flex flex-col font-sans selection:bg-brand-primary/30'>
            {/* Skip to main content link for keyboard users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--melody-purple-600)] focus:text-white focus:rounded-md"
            >
                Skip to main content
            </a>

            <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2 gap-2 relative min-h-0'>
                <AudioPlayer />

                {/* Lyrics Overlay */}
                <LyricsView />

                {/* left sidebar */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30} className="bg-transparent z-10 hidden md:block">
                    <LeftSidebar />
                </ResizablePanel>

                <ResizableHandle className='w-1 bg-transparent hover:bg-white/10 transition-colors rounded-full z-10 hidden md:block' />

                {/* Main content */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60} className="bg-transparent z-10">
                    <main id="main-content" role="main" aria-label="Main content" className="h-full rounded-2xl bg-background-elevated/50 overflow-hidden border border-white/5 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="h-full"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </ResizablePanel>

                {/* {!isMobile && (
                    <> */}
                <ResizableHandle className='w-1 bg-transparent hover:bg-white/10 transition-colors rounded-full z-10 hidden lg:block' />

                {/* right sidebar (Activity or Queue) */}
                <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0} className="bg-transparent z-10 hidden lg:block">
                    {isQueueOpen ? <QueueView /> : <ActivitySidebar />}
                </ResizablePanel>
                {/* </> */}

            </ResizablePanelGroup>

            {/* Z-index 50 ensures playback controls stay on top of everything including lyrics overlay if desired, or lyrics can be 40 */}
            <PlaybackControls />

            {/* Ambient Background Gradient for the whole app */}
            <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-br from-black via-[#0a0a0a] to-[#121212]" />
            <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </div>
    );
};
export default MainLayout;

