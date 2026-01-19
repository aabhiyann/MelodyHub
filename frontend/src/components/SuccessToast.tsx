import { MascotImage } from "@/components/MascotImage";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessToastProps {
    message: string;
    description?: string;
    duration?: number;
    onClose?: () => void;
}

export const SuccessToast = ({
    message,
    description,
    duration = 3000,
    onClose
}: SuccessToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className='fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5'>
            <div className='flex items-start gap-3 bg-neutral-800 rounded-lg p-4 shadow-2xl border border-emerald-500/20 max-w-sm'>
                {/* Melody Success Mascot */}
                <MascotImage
                    state='success'
                    size='sm'
                    className='flex-shrink-0'
                />

                {/* Message Content */}
                <div className='flex-1'>
                    <h4 className='text-white font-semibold mb-1'>
                        {message}
                    </h4>
                    {description && (
                        <p className='text-neutral-400 text-sm'>
                            {description}
                        </p>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className='text-neutral-400 hover:text-white transition-colors'
                    aria-label='Close'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
        </div>
    );
};
