import { useUser } from "@clerk/clerk-react";
import { Clock, Music, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HomeHeroProps {
    totalListeningTime: number; // in hours or minutes
    newDiscoveriesCount: number;
}

export const HomeHero = ({ totalListeningTime, newDiscoveriesCount }: HomeHeroProps) => {
    const { user } = useUser();
    const [greeting, setGreeting] = useState("");
    const [gradient, setGradient] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const updateTimeBasedContent = () => {
            const hour = new Date().getHours();

            if (hour < 5) {
                setGreeting("Late night vibes");
                setGradient("from-indigo-950 via-purple-950 to-black"); // Night
            } else if (hour < 12) {
                setGreeting("Good morning");
                setGradient("from-orange-500/20 via-amber-500/10 to-transparent"); // Sunrise warm
            } else if (hour < 18) {
                setGreeting("Good afternoon");
                setGradient("from-blue-600/20 via-cyan-500/10 to-transparent"); // Day cool
            } else {
                setGreeting("Good evening");
                setGradient("from-violet-900/30 via-purple-900/10 to-transparent"); // Evening deep
            }
        };

        updateTimeBasedContent();
        const interval = setInterval(updateTimeBasedContent, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} className={`relative rounded-3xl overflow-hidden p-8 md:p-12 transition-colors duration-1000 min-h-[400px]`}>
            {/* Background Gradient with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`}
            />
            <div className="absolute inset-0 bg-noise opacity-5" />

            {/* Animated Particles (CSS or Framer Motion) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.2, y: -20 }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.15, x: 20 }}
                    transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-[-50px] left-10 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                    >
                        <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            {greeting},
                        </span>{" "}
                        <span className="text-brand-primary">
                            {user?.firstName || "Music Lover"}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-lg text-zinc-400 font-medium"
                    >
                        Ready to discover your next favorite track?
                    </motion.p>
                </div>

                {/* Quick Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-6 pt-2"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <Clock className="size-4 text-brand-secondary" />
                        <span className="text-sm font-medium text-zinc-300">
                            {totalListeningTime > 0 ? `${Math.round(totalListeningTime / 60)}h listening` : "Start listening"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <Sparkles className="size-4 text-yellow-400" />
                        <span className="text-sm font-medium text-zinc-300">
                            {newDiscoveriesCount} new discoveries
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <Music className="size-4 text-brand-primary" />
                        <span className="text-sm font-medium text-zinc-300">
                            Weekly Top 5 available
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
