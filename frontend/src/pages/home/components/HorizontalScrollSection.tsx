import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface HorizontalScrollSectionProps {
    title: string;
    subtitle?: string;
    seeAllHref?: string;
    seeAllLabel?: string;
    children: React.ReactNode;
}

const HorizontalScrollSection = ({
    title,
    subtitle,
    seeAllHref,
    seeAllLabel = "See all",
    children,
}: HorizontalScrollSectionProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const { clientWidth } = scrollRef.current;
        const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;

        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className='relative mb-8 group/section overflow-hidden'>
            {/* Header: title (left) + See All (right) + arrows */}
            <div className="flex items-end justify-between px-6 mb-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F9FAFB]">{title}</h2>
                    {subtitle && <p className="text-[#9CA3AF] text-sm mt-1">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-2">
                    {seeAllHref && (
                        <Link
                            to={seeAllHref}
                            className="text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors shrink-0"
                        >
                            {seeAllLabel}
                        </Link>
                    )}
                    <div className="hidden md:flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover/section:opacity-100">
                        <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => scroll('left')}
                            disabled={!showLeftArrow}
                            className="rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-[#F9FAFB]"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => scroll('right')}
                            disabled={!showRightArrow}
                            className="rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-[#F9FAFB]"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className='flex overflow-x-auto gap-4 px-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 md:mx-0'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>
        </div>
    );
};

export default HorizontalScrollSection;
