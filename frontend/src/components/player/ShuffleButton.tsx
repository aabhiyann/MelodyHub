import { Shuffle } from "lucide-react";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ShuffleButton = () => {
    const { shuffled, shuffleQueue } = usePlayerStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={shuffleQueue}
            aria-label={shuffled ? "Disable Shuffle" : "Enable Shuffle"}
            aria-pressed={shuffled}
            className={cn(
                "hover:bg-white/10 transition-colors",
                shuffled ? "text-emerald-500 hover:text-emerald-400" : "text-zinc-400 hover:text-white"
            )}
            title={shuffled ? "Disable Shuffle" : "Enable Shuffle"}
        >
            <Shuffle className={cn("h-4 w-4", shuffled && "fill-current")} />
        </Button>
    );
};
