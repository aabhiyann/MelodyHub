import { cn } from "@/lib/utils";

interface SkeletonCardProps {
    className?: string;
    aspectRatio?: "square" | "video" | "portrait";
}

export const SkeletonCard = ({ className, aspectRatio = "square" }: SkeletonCardProps) => {
    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[2/3]",
    };

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className={cn(
                "w-full rounded-xl bg-zinc-800/50 animate-pulse",
                "bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer",
                aspectClasses[aspectRatio]
            )} />
            <div className="space-y-2">
                <div className="h-4 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-zinc-800/50 rounded animate-pulse" />
            </div>
        </div>
    );
};
