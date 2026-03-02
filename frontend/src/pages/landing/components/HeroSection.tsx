import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Play, ArrowRight, Music } from 'lucide-react';
import { FloatingAlbums } from '@/components/landing/FloatingAlbums';
import WaveformVisualization from '@/components/landing/WaveformVisualization';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    // Mouse Parallax Logic for 3D Card
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]); // Invert tilt for feel
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    // Smooth spring physics for the tilt
    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct * 200); // Sensitivity
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Parallax effects for background
    const yBg = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center pt-24 pb-12"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Texture & Gradients */}
            <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[140px] opacity-40 mix-blend-screen" />
                <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-brand-secondary/15 rounded-full blur-[100px] opacity-30" />
            </motion.div>

            {/* Floating Album Covers */}
            <FloatingAlbums />

            <div className="container relative z-10 px-6 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
                {/* Left Content */}
                <motion.div
                    style={{ opacity: opacityHero }}
                    className="col-span-1 lg:col-span-6 text-left flex flex-col justify-center space-y-8 lg:pr-12 relative"
                >
                    {/* Waveform Behind Text */}
                    <WaveformVisualization />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center space-x-2 relative z-10"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                        </span>
                        <span className="text-sm font-medium tracking-widest uppercase text-white/60">
                            AI-Powered Music Streaming
                        </span>
                    </motion.div>

                    <div className="space-y-4 relative z-10">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-0.04em] leading-[0.95]">
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70"
                            >
                                Your Music,
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 pb-2"
                            >
                                Reimagined
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80"
                            >
                                with AI
                            </motion.span>
                        </h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed font-light tracking-wide relative z-10"
                    >
                        Immerse yourself in high-fidelity sound, powered by AI that understands your vibe.
                        It's not just streaming; it's a personal concert.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 pt-4 relative z-10"
                    >
                        {/* Get Started Button - Sign in or go to app */}
                        {isSignedIn ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/home')}
                                className="group h-14 px-8 bg-white text-black rounded-full font-semibold text-base flex items-center justify-center space-x-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
                            >
                                <span>Open App</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/sign-up')}
                                    className="group relative z-50 h-14 px-8 bg-white text-black rounded-full font-semibold text-base flex items-center justify-center space-x-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </motion.button>
                                <a
                                    href="/sign-in"
                                    className="relative z-50 text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
                                >
                                    Already have an account? Sign in
                                </a>
                            </div>
                        )}

                        {/* Watch Demo - Scroll to features */}
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            className="h-14 px-8 rounded-full font-medium text-base text-white border border-white/10 flex items-center justify-center space-x-2 backdrop-blur-md transition-all hover:border-white/30 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <Play className="w-4 h-4" />
                            <span>See Features</span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right Content - Interactive 3D Mockup */}
                <div className="col-span-1 lg:col-span-6 relative h-[600px] w-full flex items-center justify-center perspective-[1200px]">
                    <motion.div
                        style={{
                            rotateX: springRotateX,
                            rotateY: springRotateY,
                            transformStyle: 'preserve-3d',
                        }}
                        className="relative z-20 w-[280px] h-[500px] sm:w-[360px] sm:h-[640px]"
                    >
                        {/* 3D Phone Body */}
                        <div
                            className="absolute inset-0 rounded-[55px] bg-[#0a0a0a] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden"
                            style={{
                                transform: 'translateZ(0px)',
                                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* Dynamic Glow Behind Phone */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-accent-blue/20 mix-blend-screen opacity-50 z-0"></div>

                            {/* UI Content */}
                            <div className="relative z-10 h-full flex flex-col p-8 bg-black/80 backdrop-blur-2xl">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-10 opacity-80">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5">
                                        <div className="w-4 h-4 border-2 border-white/50 rounded-sm"></div>
                                    </div>
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Now Playing</div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5">
                                        <div className="w-1 h-1 bg-white/50 rounded-full mx-[1px]"></div>
                                        <div className="w-1 h-1 bg-white/50 rounded-full mx-[1px]"></div>
                                        <div className="w-1 h-1 bg-white/50 rounded-full mx-[1px]"></div>
                                    </div>
                                </div>

                                {/* Album Art with Local Depth */}
                                <motion.div
                                    className="w-full aspect-square rounded-[32px] mb-10 relative group cursor-pointer shadow-xl overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                                    <img
                                        src="/cover-images/starboy.jpg"
                                        alt="Album Art"
                                        className="w-full h-full object-cover rounded-[32px] opacity-90 transition-opacity group-hover:opacity-100"
                                        onError={(e) => {
                                            // Fallback if image missing
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #4c1d95, #0a84ff)';
                                        }}
                                    />
                                    {/* Fallback pattern */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-accent-blue opacity-100 z-0 flex items-center justify-center">
                                        <Music className="w-24 h-24 text-white/20" />
                                    </div>

                                    {/* Glass Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
                                </motion.div>

                                {/* Song Info */}
                                <div className="space-y-4 mb-8 text-center">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Midnight City</h3>
                                    <p className="text-white/50 text-base font-medium flex items-center justify-center gap-2">
                                        M83 <span className="w-1 h-1 rounded-full bg-white/40" /> Hurry Up, We're Dreaming
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-white/10 rounded-full mb-10 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-[65%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                                </div>

                                {/* Play Controls */}
                                <div className="flex justify-between items-center px-4 mt-auto">
                                    <div className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11 16L7 12L11 8"></path>
                                            <path d="M17 16L13 12L17 8"></path>
                                        </svg>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                                    >
                                        <Play className="w-8 h-8 fill-current ml-1" />
                                    </motion.div>
                                    <div className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 8L11 12L7 16"></path>
                                            <path d="M13 8L17 12L13 16"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements/Mascot Depth */}
                        <motion.div
                            style={{
                                translateZ: 60,
                                rotateX: springRotateX,
                                rotateY: springRotateY
                            }}
                            className="absolute -top-12 -right-16 z-30 pointer-events-none"
                        >
                            <motion.img
                                src="/mascot/melody-ai.png"
                                alt="Melody AI"
                                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-36 h-36 object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Background Floating Blurred Covers */}
                        <motion.div
                            style={{ translateZ: -50 }}
                            className="absolute top-20 -left-20 w-48 h-48 rounded-3xl bg-brand-primary/30 blur-2xl z-0"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            style={{ translateZ: -80 }}
                            className="absolute bottom-40 -right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl z-0"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 cursor-pointer hover:text-white transition-colors"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-current rounded-full" />
                </div>
            </motion.div>
        </section >
    );
};

