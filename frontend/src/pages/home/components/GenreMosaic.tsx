import { useNavigate } from "react-router-dom";
import { Music, Mic2, Guitar, Headphones, Disc3, Piano, Drum } from "lucide-react";

const GENRES = [
    { name: "Pop", color: "from-pink-500 to-rose-500", icon: Mic2 },
    { name: "Rock", color: "from-red-600 to-orange-600", icon: Guitar },
    { name: "Hip Hop", color: "from-purple-600 to-indigo-600", icon: Disc3 },
    { name: "Electronic", color: "from-cyan-500 to-blue-500", icon: Headphones },
    { name: "Indie", color: "from-yellow-500 to-amber-600", icon: Music },
    { name: "Jazz", color: "from-amber-700 to-orange-800", icon: Piano },
    { name: "Classical", color: "from-slate-500 to-slate-700", icon: Piano },
    { name: "Metal", color: "from-zinc-700 to-black", icon: Drum },
];

export const GenreMosaic = () => {
    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
                <Disc3 className="size-6 text-brand-primary" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Explore Genres</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
                {GENRES.map((genre) => (
                    <div
                        key={genre.name}
                        onClick={() => navigate(`/genre/${genre.name.toLowerCase()}`)}
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl"
                    >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <div className="absolute inset-0 bg-noise opacity-10" />

                        <span className="absolute top-4 left-4 text-xl font-bold text-white tracking-wide z-10 drop-shadow-md">
                            {genre.name}
                        </span>

                        <genre.icon className="absolute bottom-[-10px] right-[-10px] size-24 text-white/20 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" />
                    </div>
                ))}
            </div>
        </section>
    );
};
