import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.beforeEach(async ({ page }) => {
	// Clear existing tapes before each test
	await page.goto('/');

	// Remove only subdirectories, not files at the root level
	const { readdir } = await import('node:fs/promises');
	const { stat } = await import('node:fs/promises');
	const { rm } = await import('node:fs/promises');
	
	try {
		// TODO: use env variable or use opinionated path for test data
		const items = await readdir('./test-data');
		for (const item of items) {
			const itemPath = `./test-data/${item}`;
			const itemStat = await stat(itemPath);
			if (itemStat.isDirectory()) {
				await rm(itemPath, { recursive: true, force: true });
			}
		}
	} catch {
		// Ignore if test-data directory doesn't exist
	}
});

test('Create multiple tapes', async ({ page }) => {
	await page.goto('/');
	
	const tapeNames = [`Tape-${randomUUID()}`, `Tape-${randomUUID()}`, `Tape-${randomUUID()}`];
	
	// Create multiple tapes
	for (const tapeName of tapeNames) {
		await page.getByTestId('create-tape-button').click();
		await page.getByTestId('tape-name-input').fill(tapeName);
		await page.getByRole('button', { name: 'Add' }).click();
	}
	
	// Verify all tapes are created
	await expect(page.getByTestId('tape-item')).toHaveCount(3);
});

test('Create tape with empty name', async ({ page }) => {
	await page.goto('/');
	
	await page.getByTestId('create-tape-button').click();
	await page.getByRole('button', { name: 'Add' }).click();
	
	// Verify tape is not created with empty name
	await expect(page.getByTestId('tape-item')).not.toBeAttached();
});

test('Cancel tape creation multiple times', async ({ page }) => {
	await page.goto('/');
	
	// Cancel creation multiple times
	for (let i = 0; i < 3; i++) {
		const tapeName = `Tape-${randomUUID()}`;
		await page.getByTestId('create-tape-button').click();
		await page.getByTestId('tape-name-input').fill(tapeName);
		await page.getByRole('button', { name: 'Cancel' }).click();
		
		await expect(page.getByText(tapeName)).not.toBeAttached();
		await expect(page.getByTestId('tape-name-input')).not.toBeAttached();
	}
	
	// Verify no tapes were created
	await expect(page.getByTestId('tape-item')).not.toBeAttached();
});

test('Navigate back from tape page', async ({ page }) => {
	await page.goto('/');
	
	const tapeName = `Tape-${randomUUID()}`;
	
	// Create tape
	await page.getByTestId('create-tape-button').click();
	await page.getByTestId('tape-name-input').fill(tapeName);
	await page.getByRole('button', { name: 'Add' }).click();
	
	// Go to tape page
	await page.getByTestId('tape-item').click();
	await expect(page).toHaveURL(`http://localhost:4173/tape/${tapeName}`);
	
	// Navigate back
	await page.goBack();
	await expect(page).toHaveURL('http://localhost:4173/');
	await expect(page.getByTestId('HomeHeading')).toBeVisible();
});

test('Direct navigation to non-existent tape', async ({ page }) => {
	const nonExistentTapeName = `NonExistent-${randomUUID()}`;
	
	await page.goto(`/tape/${nonExistentTapeName}`);
	
	// Should handle non-existent tape gracefully
	await expect(page).toHaveURL(`http://localhost:4173/tape/${nonExistentTapeName}`);

	// TODO: better 404 handling UI
	await expect(page.getByText('Tape not found')).toBeVisible();
	await page.screenshot({path: 'test-results/non-existent-tape.png'});
});