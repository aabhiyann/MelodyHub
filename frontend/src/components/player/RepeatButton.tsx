import { Repeat } from "lucide-react";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RepeatButton = () => {
    // Note: usePlayerStore uses 'isRepeating' boolean for simple toggle in original implementation,
    // but we want to support 'off' | 'one' | 'all' for better UX. 
    // For now we'll stick to the existing simple toggle unless we migrate state,
    // assuming 'shuffled' exists, but 'repeat' might be boolean 'isRepeating'.
    // Let's check the store again or just implement simple toggle if that's what we have.
    // The previous analysis showed `isRepeating: boolean` and `toggleRepeat: () => void`.
    // So we will implement a simple toggle for now, or upgrade the store.
    // Given 'polish' phase, let's stick to simple toggle first or upgrade if requested.
    // I will stick to boolean for now to match current store to avoid breaking changes without refactor.

    const { isRepeating, toggleRepeat } = usePlayerStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleRepeat}
            aria-label={isRepeating ? "Disable Repeat" : "Enable Repeat"}
            aria-pressed={isRepeating}
            className={cn(
                "hover:bg-white/10 transition-colors",
                isRepeating ? "text-emerald-500 hover:text-emerald-400" : "text-zinc-400 hover:text-white"
            )}
            title={isRepeating ? "Disable Repeat" : "Enable Repeat"}
        >
            <Repeat className={cn("h-4 w-4", isRepeating && "fill-current")} />
        </Button>
    );
};
