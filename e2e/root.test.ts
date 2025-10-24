import { expect, test } from '@playwright/test';

test('Expect login heading to be visible on root', async ({ page }) => {
	await page.goto('/'); // redirect to /login page

	await expect(page.locator('h2')).toBeVisible();
	await expect(page.locator('h2')).toHaveText('Login');
});
