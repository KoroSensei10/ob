import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build --mode test && pnpm preview',
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
