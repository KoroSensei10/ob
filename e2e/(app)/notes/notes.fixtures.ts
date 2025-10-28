import { test as base, expect } from '@playwright/test';
import { randomUUID, } from 'crypto';

type TapeFixture = {
	createTape: { tapeName: string };
	createNote: { noteName: string };
};

export const test = base.extend<TapeFixture>({
	createTape: async ({ page }, use) => {
		await page.goto('/');
	
		const tapeName = `Tape-${randomUUID()}`;
		await page.getByTestId('create-tape-button').click();
		await page.getByTestId('tape-name-input').fill(tapeName);
		await page.getByRole('button', { name: 'Add' }).click();
		await expect(page.getByText(tapeName)).toBeAttached();
	
		// Navigate into the created tape
		await page.getByText(tapeName).click();
		await use({ tapeName });
	},
	createNote: async ({ page, createTape }, use) => {
		const _ = createTape.tapeName;

		const noteName = `_${randomUUID()}_`;
		await page.getByTestId('new-entry-input').fill(noteName);
		await page.getByTestId('create-entry-button').click();
	
		await expect(page.getByTestId(`file-tree-entry-${noteName}`)).toBeAttached();
	
		await use({ noteName });
	}
});

export { expect };