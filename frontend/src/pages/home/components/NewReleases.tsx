import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Album } from "@/types";
import { OptimizedImage } from "@/components/OptimizedImage";

interface NewReleasesProps {
    albums: Album[];
    isLoading: boolean;
}

export const NewReleases = ({ albums, isLoading }: NewReleasesProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    // Use usePlayerStore if available, otherwise mock or just navigate
    // const { playAlbum } = usePlayerStore();

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        handleScroll(); // Check initial state
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [albums]);

    if (isLoading) return null; // Or skeleton

    return (
        <section className="group/section relative">
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">New Releases</h3>
                    <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider border border-brand-primary/20">
                        Fresh
                    </span>
                </div>
                <Link to="/releases" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                    See all
                </Link>
            </div>

            {/* Navigation Buttons */}
            {showLeftArrow && (
                <div className="absolute top-[60%] left-[-20px] z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all shadow-xl"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                </div>
            )}
            {showRightArrow && (
                <div className="absolute top-[60%] right-[-20px] z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 hover:scale-110 transition-all shadow-xl"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            )}

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {albums.map((album) => (
                    <div
                        key={album._id}
                        className="flex-shrink-0 w-[180px] md:w-[220px] snap-start group/card cursor-pointer"
                        onClick={() => navigate(`/album/${album._id}`)}
                    >
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg group-hover/card:shadow-2xl transition-all duration-300 group-hover/card:translate-y-[-4px]">
                            <OptimizedImage
                                src={album.imageUrl}
                                alt={album.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                                {album.releaseYear}
                            </div>

                            {/* Play Button */}
                            <div className="absolute bottom-3 right-3 opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/album/${album._id}`);
                                    }}
                                    className="p-3.5 rounded-full bg-brand-primary text-white shadow-lg hover:scale-105 transition-transform"
                                >
                                    <Play className="size-5 fill-current ml-0.5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="font-bold text-white truncate text-base group-hover/card:text-brand-primary transition-colors">
                                {album.title}
                            </h4>
                            <p className="text-sm text-zinc-400 truncate">
                                {album.artist}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
