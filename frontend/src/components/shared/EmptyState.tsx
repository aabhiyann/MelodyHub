import { MascotImage } from "@/components/shared/MascotImage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    mascotState?: 'empty' | 'default';
}

export const EmptyState = ({
    title = "Nothing here yet",
    description = "Let's add some music to get started!",
    actionLabel,
    onAction,
    mascotState = 'empty'
}: EmptyStateProps) => {
    return (
        <div className='flex flex-col items-center justify-center py-16 px-4'>
            {/* Mascot */}
            <MascotImage
                state={mascotState}
                size='lg'
                className='mb-6 drop-shadow-lg'
            />

            {/* Text */}
            <h3 className='text-2xl font-semibold text-white mb-2'>
                {title}
            </h3>
            <p className='text-neutral-400 mb-6 max-w-md text-center'>
                {description}
            </p>

            {/* Optional Action Button */}
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className='bg-brand-primary hover:bg-brand-primary/90 text-white shadow-glow-primary'
                >
                    <Plus className='mr-2 h-4 w-4' />
                    {actionLabel}
                </Button>
            )}
        </div >
    );
};
