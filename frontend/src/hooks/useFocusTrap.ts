/**
 * Focus Trap - Traps focus within a component (e.g., modals, dialogs)
 * WCAG 2.1 Success Criterion 2.1.2 (No Keyboard Trap - Level A)
 */

import { useRef, useEffect, RefObject } from 'react';

interface UseFocusTrapOptions {
    enabled?: boolean;
    initialFocus?: RefObject<HTMLElement>;
    restoreFocus?: boolean;
}

export function useFocusTrap(options: UseFocusTrapOptions = {}) {
    const {
        enabled = true,
        initialFocus,
        restoreFocus = true,
    } = options;

    const containerRef = useRef<HTMLElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const container = containerRef.current;
        if (!container) return;

        // Save currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Get all focusable elements
        const getFocusableElements = () => {
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
            ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
        };

        // Set initial focus
        const focusableElements = getFocusableElements();
        if (initialFocus?.current) {
            initialFocus.current.focus();
        } else if (focusableElements[0]) {
            focusableElements[0].focus();
        }

        // Handle tab key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = getFocusableElements();
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            container.removeEventListener('keydown', handleKeyDown);

            // Restore focus
            if (restoreFocus && previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [enabled, initialFocus, restoreFocus]);

    return containerRef;
}
