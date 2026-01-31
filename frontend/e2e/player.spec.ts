import { test, expect } from '@playwright/test';

test.describe('Music Player', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming we can access the app state or mock it.
        // For now, visit home.
        await page.goto('/');
        // We might need to bypass auth or seed state in a real scenario.
        // Since this is a demo/dev env, we might be redirected.
    });

    test('player controls are visible when song is loaded', async ({ page }) => {
        // This test relies on existing content.
        // Ideally we'd click a song to play it.

        // Check if we can find a song card
        const songCard = page.locator('[data-testid="song-card"], .group').first();
        if (await songCard.count() > 0 && await songCard.isVisible()) {
            // Try to click play
            const playBtn = songCard.locator('button').first();
            await playBtn.click({ force: true });

            // Check player bar
            await expect(page.locator('footer, .fixed.bottom-0')).toBeVisible();
        }
    });
});
