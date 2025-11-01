import { test, expect } from './notes.fixtures';

test.describe('Delete', () => {

	test('Delete note', async ({ page, createNote }) => {
		const { noteName } = createNote;
		// Delete the created note
		await page.getByTestId(`file-tree-entry-${noteName}`).click({
			button: 'right'
		});
		await page.getByTestId('delete-entry-button').click();

		await expect(page.getByTestId(`file-tree-entry-${noteName}`)).not.toBeAttached();
	});

	test.fixme('Delete note - cancel', async ({ page, createNote }) => {
		const { noteName } = createNote;
		// Attempt to delete the created note but cancel
		await page.getByTestId(`file-tree-entry-${noteName}`).click({
			button: 'right'
		});
		await page.getByTestId('delete-entry-button').click();
		// Test can pass sometimes because the network may be slow
		await expect(page.getByTestId(`file-tree-entry-${noteName}`)).toBeAttached();
	});
});
