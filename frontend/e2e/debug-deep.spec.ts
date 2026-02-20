import { test, expect } from '@playwright/test';

test('debug loading state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000);

    // Log presence of loading screen
    const loading = await page.getByTestId('loading-screen').count(); // assuming testid, or class
    console.log('Loading screen count:', loading);

    // Log body html
    console.log(await page.content());
});
