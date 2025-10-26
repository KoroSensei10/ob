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
	
	await page.getByTestId('new-entry-input').fill('MyFirstNote.md');
	await page.getByTestId('create-entry-button').click();

	await expect(page.getByText('MyFirstNote.md')).toBeVisible();
	await page.screenshot({path: 'test-results/create-note.png'});
});