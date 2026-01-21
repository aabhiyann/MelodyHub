/**
 * OptimizedImage - Performance-optimized image component
 * Features: Lazy loading, blur placeholder, WebP support, error fallback
 */

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    blur?: boolean;
}

export const OptimizedImage = ({
    src,
    alt,
    className,
    blur = true,
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className={cn('relative overflow-hidden bg-surface', className)}>
            {/* Blur placeholder */}
            {blur && !isLoaded && (
                <div className='absolute inset-0 animate-shimmer bg-gradient-to-r from-surface via-surface-raised to-surface' />
            )}

            {/* Actual image */}
            <img
                ref={imgRef}
                src={isInView ? src : undefined}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={cn(
                    'transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className
                )}
                loading='lazy'
                {...props}
            />

            {/* Error fallback */}
            {hasError && (
                <div className='absolute inset-0 flex items-center justify-center bg-surface text-text-tertiary'>
                    <svg className='size-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};
