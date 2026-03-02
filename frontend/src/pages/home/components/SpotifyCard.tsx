/**
 * SpotifyCard - Unified content card for horizontal rows (song/album/playlist).
 * DESIGN_PLAN: 12px radius, hover scale + shadow, text #F9FAFB / #9CA3AF, accent #22C55E for play.
 */

import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface SpotifyCardProps {
    imageUrl: string;
    title: string;
    description?: string;
    onClick?: () => void;
    href?: string;
    /** Optional: show play button and call onPlayClick instead of onClick for play */
    onPlayClick?: (e: React.MouseEvent) => void;
    className?: string;
    /** Card width in horizontal row; default 160px */
    width?: number;
}

export const SpotifyCard = ({
    imageUrl,
    title,
    description,
    onClick,
    href,
    onPlayClick,
    className = "",
    width = 160,
}: SpotifyCardProps) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (href) {
            navigate(href);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div
            role={href ? "link" : "button"}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (href) navigate(href);
                    else onClick?.();
                }
            }}
            className={`group/card flex-shrink-0 snap-start cursor-pointer ${className}`}
            style={{ width: `${width}px` }}
        >
            <div className="relative aspect-square overflow-hidden rounded-[12px] mb-3 shadow-lg transition-all duration-200 group-hover/card:shadow-xl group-hover/card:scale-[1.03]">
                <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/placeholder-album.svg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200" />
                {onPlayClick && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlayClick(e);
                        }}
                        className="absolute bottom-2 right-2 p-2.5 rounded-full bg-[#22C55E] text-[#020617] shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-[#16A34A]"
                        aria-label={`Play ${title}`}
                    >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                )}
            </div>
            <p className="font-semibold text-sm truncate text-[#F9FAFB]">{title}</p>
            {description != null && description !== "" && (
                <p className="text-xs truncate text-[#9CA3AF] mt-0.5">{description}</p>
            )}
        </div>
    );
};
