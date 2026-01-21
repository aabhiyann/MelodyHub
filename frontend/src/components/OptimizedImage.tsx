/**
 * Enhanced OptimizedImage component with WebP support
 * Lazy loading, blur placeholder, and responsive images
 */

import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/performance';
import { getCloudinaryUrl, generateSrcSet, generateBlurPlaceholder, imageSizes } from '@/utils/imageOptimizer';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    size?: keyof typeof imageSizes;
    customOptions?: {
        width?: number;
        height?: number;
        quality?: number;
    };
    showBlurPlaceholder?: boolean;
    priority?: boolean; // Disable lazy loading for above-the-fold images
}

export const OptimizedImage = ({
    src,
    alt,
    size,
    customOptions,
    showBlurPlaceholder = true,
    priority = false,
    className,
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { rootMargin: '50px' });

    // Determine if image should load
    const shouldLoad = priority || isInView;

    // Get image options
    const imageOptions = size ? imageSizes[size] : customOptions;

    // Generate optimized URLs
    const optimizedSrc = imageOptions ? getCloudinaryUrl(src, imageOptions) : src;
    const blurDataUrl = showBlurPlaceholder ? generateBlurPlaceholder(src) : undefined;
    const srcSet = imageOptions?.width ? generateSrcSet(src) : undefined;

    // Preload priority images
    useEffect(() => {
        if (priority && imageOptions) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = optimizedSrc;
            if (srcSet) {
                link.setAttribute('imagesrcset', srcSet);
            }
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, [priority, optimizedSrc, srcSet, imageOptions]);

    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
    };

    // Handle image error
    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={containerRef}
            className={cn('relative overflow-hidden', className)}
            style={{ backgroundColor: '#f3f4f6' }}
        >
            {/* Blur placeholder */}
            {showBlurPlaceholder && blurDataUrl && !isLoaded && (
                <img
                    src={blurDataUrl}
                    alt=''
                    aria-hidden='true'
                    className='absolute inset-0 w-full h-full object-cover scale-110 blur-xl'
                />
            )}

            {/* Main image */}
            {shouldLoad && !error && (
                <img
                    ref={imgRef}
                    src={optimizedSrc}
                    srcSet={srcSet}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding='async'
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                    {...props}
                />
            )}

            {/* Error fallback */}
            {error && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400'>
                    <svg
                        className='size-8'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                    </svg>
                </div>
            )}

            {/* Loading skeleton */}
            {!isLoaded && !error && (
                <div className='absolute inset-0 animate-pulse bg-gray-200' />
            )}
        </div>
    );
};
