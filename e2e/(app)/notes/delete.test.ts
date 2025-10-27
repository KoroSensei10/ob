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
});
