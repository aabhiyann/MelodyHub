/**
 * Mobile utility functions
 * Helpers for mobile-specific functionality
 */

/**
 * Vibrate device (if supported)
 */
export function vibrate(pattern: number | number[] = 50): void {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

/**
 * Check if device is iOS
 */
export function isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Check if device is Android
 */
export function isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
}

/**
 * Get iOS version
 */
export function getIOSVersion(): number | null {
    if (!isIOS()) return null;

    const match = navigator.userAgent.match(/OS (\d+)_/);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * Fix iOS 100vh issue
 * Use CSS: height: calc(var(--vh, 1vh) * 100)
 */
export function fixIOSViewportHeight(): void {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
}

/**
 * Prevent pull-to-refresh on iOS
 */
export function preventPullToRefresh(): void {
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const y = e.touches[0].pageY;
        const scrolled = window.scrollY || document.documentElement.scrollTop;

        // Prevent native pull-to-refresh if at top and pulling down
        if (scrolled === 0 && y > startY) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Add to home screen prompt for iOS
 */
export function showIOSInstallPrompt(): string | null {
    if (!isIOS()) return null;

    const isStandalone = (window.navigator as any).standalone === true;
    if (isStandalone) return null;

    return 'To install this app, tap the Share button and then "Add to Home Screen".';
}

/**
 * Lock body scroll (for modals)
 */
export function lockBodyScroll(): () => void {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
    };
}

/**
 * Safe area insets (for notched devices)
 */
export function getSafeAreaInsets() {
    const style = getComputedStyle(document.documentElement);

    return {
        top: style.getPropertyValue('--safe-area-inset-top') || '0px',
        bottom: style.getPropertyValue('--safe-area-inset-bottom') || '0px',
        left: style.getPropertyValue('--safe-area-inset-left') || '0px',
        right: style.getPropertyValue('--safe-area-inset-right') || '0px',
    };
}
