import { describe, it, expect, beforeEach } from 'vitest';
import { useAccessibilityStore } from '../AccessibilityStore';

describe('useAccessibilityStore', () => {
    beforeEach(() => {
        useAccessibilityStore.getState().resetSettings();
    });

    it('initializes with default settings', () => {
        const state = useAccessibilityStore.getState();
        expect(state.highContrast).toBe(false);
        expect(state.largeText).toBe(false);
        expect(state.reducedMotion).toBe(false);
        expect(state.screenReaderOptimized).toBe(false);
    });

    it('toggles settings correctly', () => {
        const store = useAccessibilityStore.getState();

        store.setHighContrast(true);
        expect(useAccessibilityStore.getState().highContrast).toBe(true);

        store.setLargeText(true);
        expect(useAccessibilityStore.getState().largeText).toBe(true);

        store.setReducedMotion(true);
        expect(useAccessibilityStore.getState().reducedMotion).toBe(true);

        store.setScreenReaderOptimized(true);
        expect(useAccessibilityStore.getState().screenReaderOptimized).toBe(true);
    });

    it('resets settings to default', () => {
        const store = useAccessibilityStore.getState();
        store.setHighContrast(true);
        store.setLargeText(true);

        store.resetSettings();

        const state = useAccessibilityStore.getState();
        expect(state.highContrast).toBe(false);
        expect(state.largeText).toBe(false);
    });
});
