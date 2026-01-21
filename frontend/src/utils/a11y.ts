/**
 * Accessibility utilities and helpers
 * WCAG 2.1 compliant helper functions
 */

/**
 * Generate unique IDs for accessibility
 */
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;

    const tabindex = element.getAttribute('tabindex');
    if (tabindex === '-1') return false;

    const focusableSelectors = [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        '[tabindex]',
    ];

    return focusableSelectors.some(selector =>
        element.matches(selector)
    );
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
        container.querySelectorAll<HTMLElement>(selector)
    ).filter(el =>
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true'
    );
}

/**
 * Trap focus within element
 */
export function trapFocus(element: HTMLElement) {
    const focusableElements = getFocusableElements(element);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
        element.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Create ARIA description
 */
export function createAriaDescription(
    element: HTMLElement,
    description: string
): () => void {
    const id = generateId('description');
    const descEl = document.createElement('div');
    descEl.id = id;
    descEl.className = 'sr-only';
    descEl.textContent = description;

    document.body.appendChild(descEl);
    element.setAttribute('aria-describedby', id);

    return () => {
        element.removeAttribute('aria-describedby');
        descEl.remove();
    };
}

/**
 * Announce to screen readers
 */
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
    const announcer = document.createElement('div');
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');

    document.body.appendChild(announcer);

    // Force reflow
    void announcer.offsetHeight;

    announcer.textContent = message;

    setTimeout(() => {
        announcer.remove();
    }, 1000);
}

/**
 * Check color contrast ratio
 * Returns true if contrast meets WCAG AA (4.5:1 for normal text)
 */
export function meetsContrastRequirement(
    foreground: string,
    background: string,
    largeText: boolean = false
): boolean {
    const minRatio = largeText ? 3 : 4.5; // AA standard
    const ratio = getContrastRatio(foreground, background);
    return ratio >= minRatio;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
    const l1 = getRelativeLuminance(color1);
    const l2 = getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
    // This is a simplified version
    // In production, use a library like 'color' or 'tinycolor2'
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
