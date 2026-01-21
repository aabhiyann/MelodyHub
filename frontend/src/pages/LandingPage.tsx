import Hero from "../components/landing/Hero";
import { Music, Mic2, Radio, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-brand-primary/30">
            <Hero />

            {/* Features Section to enable scrolling */}
            <section className="relative z-10 py-32 bg-background-elevated border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-display font-bold mb-6">Designed for Audiophiles</h2>
                        <p className="text-white/60 text-lg">
                            Experience the difference with features built for those who listen closely.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Music, title: "Crystal Clear Sound", desc: "Stream your favorite tracks in high fidelity." },
                            { icon: Mic2, title: "Immersive Experience", desc: "Get lost in the music with our optimized audio engine." },
                            { icon: Radio, title: "Smart Radio", desc: "Infinite mixes based on your unique taste profile." },
                            { icon: Zap, title: "Instant Playback", desc: "No buffering, just music whenever you want it." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <feature.icon className="w-10 h-10 text-brand-primary mb-6" />
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-white/50">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Placeholder */}
            <footer className="py-20 bg-black border-t border-white/10 text-center text-white/40">
                <p>&copy; 2026 MelodyHub Inc. Sound Reinvented.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
