import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm tsx scripts/setup-test-db.ts && pnpm build --mode test && pnpm preview',
		port: 4173
	},
	testDir: 'e2e',
	globalSetup: './playwright/global-setup.ts',
	use: {
		baseURL: 'http://localhost:4173/',
		storageState: './playwright/state.json',
		screenshot: 'only-on-failure',
	},
	workers: 1
});
