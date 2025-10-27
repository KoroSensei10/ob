import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build --mode test && pnpm preview',
		port: 4173
	},
	testDir: 'e2e',
	projects: [
		{
			name: 'Create initial user and login',
			testMatch: /global\.setup\.ts/,
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['Create initial user and login'],
		},
	],
	use: {
		baseURL: 'http://localhost:4173/',
		storageState: './playwright/state.json',
		screenshot: 'only-on-failure',
	},
	workers: 1
});
