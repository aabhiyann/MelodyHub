import { Star } from 'lucide-react';

export const SocialProofSection = () => {
    return (
        <section className="py-32 px-6 relative bg-zinc-900/50">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-16 text-white">Loved by Music Enthusiasts</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

                    {[
                        { name: "Sarah Jenkins", role: "Playlist Curator", initial: "S", text: "MelodyHub has completely changed how I discover music. The AI playlists are eerily accurate!" },
                        { name: "Mike Chen", role: "Audiophile", initial: "M", text: "The sound quality is unmatched. I can finally hear every detail in my favorite tracks." },
                        { name: "Alex Rivera", role: "Casual Listener", initial: "A", text: "I love the shared listening parties. It feels like hanging out with friends IRL." }
                    ].map((user, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                    {user.initial}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{user.name}</h4>
                                    <p className="text-sm text-zinc-400">{user.role}</p>
                                </div>
                            </div>
                            <p className="text-zinc-300 italic mb-6">"{user.text}"</p>
                            <div className="flex text-yellow-500 gap-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-16">
                    {[
                        { label: "Active Users", value: "100K+" },
                        { label: "Songs Streamed", value: "10M+" },
                        { label: "Playlists Created", value: "500K+" },
                        { label: "Average Rating", value: "4.8★" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">{stat.value}</div>
                            <div className="text-xs md:text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
