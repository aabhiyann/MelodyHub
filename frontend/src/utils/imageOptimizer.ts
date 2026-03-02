/**
 * Image optimization utilities
 * Cloudinary transformations, WebP support detection, responsive images
 */

/** Fallback image for broken or missing album art */
export const PLACEHOLDER_ALBUM = '/placeholder-album.svg';

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;

    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

/**
 * Cloudinary image options
 */
export interface CloudinaryOptions {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    blur?: number;
    dpr?: 1 | 2 | 3;
}

/**
 * Generate Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
    url: string,
    options: CloudinaryOptions = {}
): string {
    // If not a Cloudinary URL, return as-is
    if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
        return url;
    }

    const {
        width,
        height,
        crop = 'fill',
        quality = 'auto',
        format = 'auto',
        blur,
        dpr = 1,
    } = options;

    // Build transformation string
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (blur) transformations.push(`e_blur:${blur}`);
    if (dpr > 1) transformations.push(`dpr_${dpr}`);

    const transformString = transformations.join(',');

    // Insert transformations into URL
    // Example: /upload/v123/image.jpg -> /upload/w_800,f_auto/v123/image.jpg
    return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Generate responsive srcset for images
 */
export function generateSrcSet(
    url: string,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
    return widths
        .map((width) => {
            const optimizedUrl = getCloudinaryUrl(url, {
                width,
                format: 'auto',
                quality: 'auto',
            });
            return `${optimizedUrl} ${width}w`;
        })
        .join(', ');
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
    url: string,
    width: number = 40
): string {
    return getCloudinaryUrl(url, {
        width,
        quality: 10,
        blur: 1000,
        format: 'jpg',
    });
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, options?: CloudinaryOptions): void {
    if (typeof window === 'undefined') return;

    const optimizedUrl = options ? getCloudinaryUrl(url, options) : url;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedUrl;

    // Add srcset for responsive images
    if (options?.width) {
        link.setAttribute('imagesrcset', generateSrcSet(url));
    }

    document.head.appendChild(link);
}

/**
 * Lazy load image with Intersection Observer
 */
export function lazyLoadImage(
    img: HTMLImageElement,
    options?: IntersectionObserverInit
): void {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        const src = img.dataset.src;
        if (src) img.src = src;
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLImageElement;
                const src = target.dataset.src;
                const srcset = target.dataset.srcset;

                if (src) target.src = src;
                if (srcset) target.srcset = srcset;

                target.classList.add('loaded');
                observer.unobserve(target);
            }
        });
    }, options);

    observer.observe(img);
}

/**
 * Image size presets for common use cases
 */
export const imageSizes = {
    thumbnail: { width: 150, height: 150, quality: 80 },
    small: { width: 300, height: 300, quality: 80 },
    medium: { width: 640, height: 640, quality: 85 },
    large: { width: 1200, height: 1200, quality: 90 },
    hero: { width: 1920, height: 1080, quality: 85 },
    avatar: { width: 100, height: 100, quality: 90, crop: 'fill' as const },
};
