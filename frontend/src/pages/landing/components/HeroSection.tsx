import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';

export const HeroSection = () => {
    // Scroll handling for parallax will go here
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={targetRef} className="relative h-screen min-h-[800px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Gradients & Animations */}

            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Text */}
                <div className="text-center lg:text-left">
                    {/* Eyebrow */}
                    <div className="inline-block px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
                        Powered by AI ✨
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-primary-200">
                        Your Music,<br />Reimagined.
                    </h1>

                    <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Stream millions of songs, create AI-powered playlists, and connect with friends through music. All in one beautiful app.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary to-blue-500 text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand-primary/25">
                            Get Started Free <ArrowRight size={20} />
                        </button>

                        <button className="px-8 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                            Watch Demo <Play size={18} fill="currentColor" />
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800" />
                            ))}
                        </div>
                        <p className="text-sm text-white/60 font-medium">Join 100,000+ music lovers</p>
                    </div>
                </div>

                {/* Right Side: Visual Showcase */}
                <div className="relative hidden lg:block h-[600px]">
                    {/* 3D Mockup Container */}
                    <motion.div style={{ y }} className="relative z-10 h-full">
                        {/* Mockup Placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-white/10 shadow-2xl skew-y-3 transform hover:scale-105 transition-transform duration-500">
                            {/* Inner Screen Content */}
                        </div>

                        {/* Floating Elements (Now Playing, AI Badge, etc.) */}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="text-white/50" />
            </div>
        </section>
    );
};
