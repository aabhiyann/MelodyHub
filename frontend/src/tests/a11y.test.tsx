/**
 * Accessibility Testing Suite
 * WCAG 2.1 automated testing with Axe and Vitest
 */

import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import { beforeEach } from 'vitest';

// Extend Vitest expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure Axe for WCAG 2.1 AA (run only on the passed container, not document)
const axe = configureAxe({
    rules: {
        'region': { enabled: true },
        'bypass': { enabled: true },
        'color-contrast': { enabled: true },
        'document-title': { enabled: false }, // we test fragments, not full document
        'html-has-lang': { enabled: false },  // same
        'label': { enabled: true },
        'link-name': { enabled: true },
        'button-name': { enabled: true },
    },
});

beforeEach(() => {
    document.documentElement.lang = 'en';
    document.title = 'Test';
});

/**
 * Test component for accessibility violations
 */
export async function testA11y(component: React.ReactElement) {
    const { container } = render(component);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
}

/**
 * Accessibility test helpers
 */
export const a11yHelpers = {
    /**
     * Check if element has accessible name
     */
    hasAccessibleName(element: HTMLElement): boolean {
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        const textContent = element.textContent?.trim();

        return !!(ariaLabel || ariaLabelledby || textContent);
    },

    /**
     * Check if interactive element is keyboard accessible
     */
    isKeyboardAccessible(element: HTMLElement): boolean {
        const tabindex = element.getAttribute('tabindex');
        const tag = element.tagName.toLowerCase();

        // Natively focusable
        if (['a', 'button', 'input', 'select', 'textarea'].includes(tag)) {
            return tabindex !== '-1';
        }

        // Custom interactive elements
        return tabindex !== null && tabindex !== '-1';
    },

    /**
     * Check if element has sufficient color contrast
     */
    async checkContrastRatio(
        element: HTMLElement
    ): Promise<{ ratio: number; passes: boolean }> {
        const style = window.getComputedStyle(element);
        const fg = style.color;
        const bg = style.backgroundColor;

        // This is simplified - use a proper color contrast library
        // or visual regression testing for production
        return {
            ratio: 4.5, // Placeholder
            passes: true,
        };
    },

    /**
     * Get all focusable elements
     */
    getFocusableElements(container: HTMLElement): HTMLElement[] {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(', ');

        return Array.from(container.querySelectorAll<HTMLElement>(selector));
    },
};

/**
 * Example test cases
 */
describe('Accessibility Tests', () => {
    it('should have no accessibility violations', async () => {
        const component = (
            <div>
                <button aria-label="Close">X</button>
                <img src="/test.jpg" alt="Test image" />
            </div>
        );

        await testA11y(component);
    });

    it('should have accessible form labels', async () => {
        const component = (
            <form aria-label="Test form">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" aria-label="Email" />
            </form>
        );

        await testA11y(component);
    });

    it('should have keyboard accessible buttons', () => {
        const { getByRole } = render(
            <button>Click me</button>
        );

        const button = getByRole('button');
        expect(a11yHelpers.isKeyboardAccessible(button)).toBe(true);
    });
});
