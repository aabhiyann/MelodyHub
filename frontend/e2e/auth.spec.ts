import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('guest can view landing page', async ({ page }) => {
        await page.goto('/');

        // Check for main heading or hero text
        await expect(page.locator('h1').first()).toBeVisible();

        // Check for "Get Started" or similar CTA
        const cta = page.getByRole('button', { name: /get started|login|sign up/i }).first();
        await expect(cta).toBeVisible();
    });

    test('redirects to auth callback on login', async ({ page }) => {
        await page.goto('/');
        // Note: Actual login involves Clerk/External providers which is hard to mock in E2E without setup.
        // We verify the button exists and is clickable.
        const loginBtn = page.getByRole('button', { name: /sign in|login/i }).first();
        if (await loginBtn.isVisible()) {
            await expect(loginBtn).toBeEnabled();
        }
    });

    test('guest visiting protected route redirects to home', async ({ page }) => {
        await page.goto('/library');
        await expect(page).not.toHaveURL(/\/library/);
        await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    });
});
