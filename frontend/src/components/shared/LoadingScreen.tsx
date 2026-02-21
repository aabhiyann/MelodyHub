import { MascotImage } from "@/components/shared/MascotImage";

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingScreen = ({ message = "Finding the perfect vibe...", fullScreen = true }: LoadingScreenProps) => {
    return (
        <div className={`flex flex-col items-center justify-center bg-surface-base ${fullScreen ? 'min-h-screen' : 'h-full min-h-[50vh] rounded-2xl w-full'}`}>
            {/* Animated Melody mascot */}
            <div className='mb-6 animate-pulse'>
                <MascotImage
                    state='loading'
                    size='lg'
                    className='drop-shadow-2xl'
                />
            </div>

            {/* Loading message */}
            <p className='text-neutral-400 text-lg animate-pulse'>
                {message}
            </p>

            {/* Optional loading dots */}
            <div className='flex gap-2 mt-4'>
                <div className='w-2 h-2 bg-brand-primary rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                <div className='w-2 h-2 bg-brand-primary rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                <div className='w-2 h-2 bg-brand-primary rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
};
