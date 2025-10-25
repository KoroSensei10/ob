import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

vi.mock('../../lib/remotes/tapes.remote.ts',() => ({
	getExistingTapes: vi.fn().mockResolvedValue([
		'tape1', 'tape2', 'tape3'
	]),
	// mock form remote function
	createTape: {
		enhance: vi.fn().mockImplementation((callback) => {
			return {
				submit: async () => {
					callback({ tapeName: 'NewTape' });
				}
			};
		})
	},
	removeTape: vi.fn()
}));

vi.mock('../../hooks.server.ts', () => ({
	handle: vi.fn() // no redirect
}));

describe('/+page.svelte', () => {
	beforeEach(() => {
		render(Page);
	});
	it('should render h2', async () => {

		const heading = page.getByRole('heading', { level: 2 });
		await expect.element(heading).toBeInTheDocument();
	});
	it('should show existing tapes', async () => {
		const tapeItems = page.getByTestId('tape-item');
		await expect.element(tapeItems.nth(0)).toHaveTextContent('tape1');
		await expect.element(tapeItems.nth(1)).toHaveTextContent('tape2');
		await expect.element(tapeItems.nth(2)).toHaveTextContent('tape3');
	});
	it('should open create tape form', async () => {
		const createButton = page.getByTestId('create-tape-button');
		await expect.element(createButton).toBeInTheDocument();
		await createButton.click();
		const tapeNameInput = page.getByTestId('tape-name-input');
		await expect.element(tapeNameInput).toBeInTheDocument();
	});
});