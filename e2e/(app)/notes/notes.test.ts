import { test, expect } from './notes.fixtures';


test.describe('Notes', () => {

	test.beforeEach(async ({ createTape }) => {
		// create the tape
		const { tapeName: _ } = createTape;
	});

	test('Rename note', async ({ page, createNote }) => {
		const { noteName } = createNote;

		// Rename the created note
		await page.getByTestId(`file-tree-entry-${noteName}`).click({
			button: 'right'
		});
		await page.getByTestId('rename-entry-button').click();
		const newNoteName = noteName + '-Renamed';
		const renameInput = page.getByTestId('rename-entry-input');
		await renameInput.fill(newNoteName);
		await renameInput.press('Enter');

		await expect(page.getByTestId(`file-tree-entry-${noteName}`)).not.toBeAttached();
		await expect(page.getByTestId(`file-tree-entry-${newNoteName}`)).toBeAttached();
	});

});