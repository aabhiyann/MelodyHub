import { test, expect } from '@playwright/test';

test('debug landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'debug-landing.png', fullPage: true });
    const content = await page.content();
    console.log(content);
});
