
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    supportsWebP,
    getCloudinaryUrl,
    generateSrcSet,
    generateBlurPlaceholder,
    preloadImage,
    lazyLoadImage,
} from '../imageOptimizer';

describe('imageOptimizer', () => {
    describe('supportsWebP', () => {
        it('returns false when window is undefined', () => {
            const originalWindow = globalThis.window;
            // @ts-ignore
            delete globalThis.window;
            expect(supportsWebP()).toBe(false);
            globalThis.window = originalWindow;
        });

        it('returns true when canvas supports webp', () => {
            const mockToDataURL = vi.fn().mockReturnValue('data:image/webp;base64,...');
            const mockGetContext = vi.fn().mockReturnValue(true);

            const originalCreateElement = document.createElement;
            document.createElement = vi.fn().mockReturnValue({
                getContext: mockGetContext,
                toDataURL: mockToDataURL,
            }) as any;

            expect(supportsWebP()).toBe(true);

            document.createElement = originalCreateElement;
        });

        it('returns false when canvas does not support webp', () => {
            const mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,...');
            const mockGetContext = vi.fn().mockReturnValue(true);

            const originalCreateElement = document.createElement;
            document.createElement = vi.fn().mockReturnValue({
                getContext: mockGetContext,
                toDataURL: mockToDataURL,
            }) as any;

            expect(supportsWebP()).toBe(false);

            document.createElement = originalCreateElement;
        });
    });

    describe('getCloudinaryUrl', () => {
        it('returns original url if not cloudinary', () => {
            const url = 'https://example.com/image.jpg';
            expect(getCloudinaryUrl(url)).toBe(url);
        });

        it('adds transformations to cloudinary url', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = getCloudinaryUrl(url, { width: 100, height: 100 });
            expect(result).toContain('w_100');
            expect(result).toContain('h_100');
        });

        it('uses default options', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = getCloudinaryUrl(url);
            expect(result).toContain('c_fill');
            expect(result).toContain('q_auto');
            expect(result).toContain('f_auto');
        });

        it('handles all options', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = getCloudinaryUrl(url, {
                width: 500,
                height: 300,
                crop: 'scale',
                quality: 80,
                format: 'webp',
                blur: 500,
                dpr: 2
            });
            expect(result).toContain('w_500');
            expect(result).toContain('h_300');
            expect(result).toContain('c_scale');
            expect(result).toContain('q_80');
            expect(result).toContain('f_webp');
            expect(result).toContain('e_blur:500');
            expect(result).toContain('dpr_2');
        });
    });

    describe('generateSrcSet', () => {
        it('generates srcset string with default widths', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = generateSrcSet(url);
            expect(result).toContain('640w');
            expect(result).toContain('750w');
            expect(result).toContain('1920w');
        });

        it('generates srcset with custom widths', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = generateSrcSet(url, [100, 200]);
            expect(result).toContain('100w');
            expect(result).toContain('200w');
            expect(result).not.toContain('640w');
        });
    });

    describe('generateBlurPlaceholder', () => {
        it('generates a low quality blurred image url', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
            const result = generateBlurPlaceholder(url);
            expect(result).toContain('w_40');
            expect(result).toContain('q_10');
            expect(result).toContain('e_blur:1000');
        })
    });

    describe('preloadImage', () => {
        it('does nothing if window is undefined', () => {
            const originalWindow = globalThis.window;
            // @ts-ignore
            delete globalThis.window;

            const appendChildSpy = vi.spyOn(document.head, 'appendChild');
            preloadImage('test.jpg');
            expect(appendChildSpy).not.toHaveBeenCalled();

            globalThis.window = originalWindow;
        });

        it('creates and appends link element', () => {
            const appendChildSpy = vi.spyOn(document.head, 'appendChild');
            preloadImage('https://example.com/test.jpg');

            expect(appendChildSpy).toHaveBeenCalled();
            const link = appendChildSpy.mock.calls[0][0] as HTMLLinkElement;
            expect(link.rel).toBe('preload');
            expect(link.as).toBe('image');
            expect(link.href).toBe('https://example.com/test.jpg');
        });

        it('supports responsive preload', () => {
            const setAttributeSpy = vi.spyOn(HTMLLinkElement.prototype, 'setAttribute');
            preloadImage('https://res.cloudinary.com/demo/image/upload/v123/sample.jpg', { width: 100 });

            expect(setAttributeSpy).toHaveBeenCalledWith('imagesrcset', expect.any(String));
        });
    });

    describe('lazyLoadImage', () => {
        let observeSpy: any;
        let unobserveSpy: any;
        let MockIntersectionObserver: any;
        let originalObserver: any;
        let observerCallback: any;

        beforeEach(() => {
            observeSpy = vi.fn();
            unobserveSpy = vi.fn();

            MockIntersectionObserver = class {
                constructor(callback: any) {
                    observerCallback = callback;
                }
                observe = observeSpy;
                unobserve = unobserveSpy;
                disconnect = vi.fn();
                takeRecords = vi.fn();
            };

            originalObserver = globalThis.IntersectionObserver;
            globalThis.IntersectionObserver = MockIntersectionObserver;
            window.IntersectionObserver = MockIntersectionObserver;
        });

        afterEach(() => {
            globalThis.IntersectionObserver = originalObserver;
            window.IntersectionObserver = originalObserver;
            observerCallback = undefined;
        });

        it('falls back if IntersectionObserver is not supported', () => {
            // @ts-ignore
            delete globalThis.IntersectionObserver;
            // @ts-ignore
            delete window.IntersectionObserver;

            const img = document.createElement('img');
            img.dataset.src = 'real-image.jpg';

            lazyLoadImage(img);
            expect(img.src).toContain('real-image.jpg');
        });

        it('observes the image', () => {
            const img = document.createElement('img');
            lazyLoadImage(img);
            expect(observeSpy).toHaveBeenCalledWith(img);
        });

        it('loads image when intersecting', () => {
            const img = document.createElement('img');
            img.dataset.src = 'real-image.jpg';
            img.dataset.srcset = 'real-image.jpg 1x';

            lazyLoadImage(img);

            // Trigger the observer callback
            const entry = {
                isIntersecting: true,
                target: img
            };
            observerCallback([entry]);

            expect(img.src).toContain('real-image.jpg');
            expect(img.srcset).toBe('real-image.jpg 1x');
            expect(img.classList.contains('loaded')).toBe(true);
            expect(unobserveSpy).toHaveBeenCalledWith(img);
        });

        it('does not load image when not intersecting', () => {
            const img = document.createElement('img');
            img.dataset.src = 'real-image.jpg';

            lazyLoadImage(img);

            // Trigger the observer callback
            const entry = {
                isIntersecting: false,
                target: img
            };
            observerCallback([entry]);

            expect(img.src).toBe('');
        });
    });
});
