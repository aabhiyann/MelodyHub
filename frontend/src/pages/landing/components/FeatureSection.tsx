import { Music, MessageCircle, Headphones, Cloud, Download, Compass } from 'lucide-react';

export const FeatureSection = () => {
    const features = [
        {
            icon: <Music className="w-7 h-7" />,
            title: "AI-Powered Playlists",
            desc: "Let AI curate perfect playlists based on your mood and taste.",
            gradient: "from-emerald-500 to-green-600"
        },
        {
            icon: <MessageCircle className="w-7 h-7" />,
            title: "Real-Time Chat",
            desc: "Connect with friends and see what they're listening to in real-time.",
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            icon: <Headphones className="w-7 h-7" />,
            title: "High-Quality Audio",
            desc: "Stream in crystal-clear quality up to 320kbps for the best experience.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: <Cloud className="w-7 h-7" />,
            title: "Cross-Device Sync",
            desc: "Start on one device, continue on another without missing a beat.",
            gradient: "from-blue-500 to-indigo-500"
        },
        {
            icon: <Download className="w-7 h-7" />,
            title: "Offline Listening",
            desc: "Download your favorite songs and playlists for offline enjoyment.",
            gradient: "from-green-500 to-teal-500"
        },
        {
            icon: <Compass className="w-7 h-7" />,
            title: "Personalized Discovery",
            desc: "Discover new music tailored to your unique taste every day.",
            gradient: "from-rose-500 to-emerald-500"
        }
    ];

    return (
        <section id="features" className="py-32 px-6 relative z-10 bg-zinc-950">
            <div className="container mx-auto">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Everything You Need to Enjoy Music
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Experience the difference with features built for those who listen closely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-10 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
