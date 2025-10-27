import test, { expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.beforeEach(async ({ page }) => {
	// Create a tape before each note test
	await page.goto('/');
	
	const tapeName = `Tape-${randomUUID()}`;
	await page.getByTestId('create-tape-button').click();
	await page.getByTestId('tape-name-input').fill(tapeName);
	await page.getByRole('button', { name: 'Add' }).click();
	
	// Navigate into the created tape
	await page.getByText(tapeName).click();
});

test('Create a note inside a tape', async ({ page }) => {
	// const tapeUrl = page.url();
	
	const noteName = 'Note-' + randomUUID();
	await page.getByTestId('new-entry-input').fill(noteName);
	await page.getByTestId('create-entry-button').click();

	await expect(page.getByRole('region').getByRole('button', { name: noteName })).toBeAttached();
});