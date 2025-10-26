import { chromium, type FullConfig } from '@playwright/test';
import { testUser } from '../e2e/data';

async function globalSetup(config: FullConfig) {
	const { baseURL, storageState } = config.projects[0].use;
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(baseURL!);
	await page.fill('input[name="email"]', testUser.email);
	await page.fill('input[name="password"]', testUser.password);
	await page.click('button[type="submit"]');
	await page.waitForURL(baseURL!);
	await page.context().storageState({ path: storageState as string });
	await browser.close();
}

export default globalSetup;