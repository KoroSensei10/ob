import { removeEntry, renameEntry } from '$lib/remotes/files.remote';
import { openFilesStore } from '$stores/OpenFiles.svelte';

export async function renameEntryClient (entryPath: string, newName: string): Promise<void> {
	const modifications = await renameEntry({ entryPath, newName });
	openFilesStore.applyModifications(modifications);
}

export async function removeEntryClient (entryPath: string): Promise<void> {
	const modifications = await removeEntry({ entryPath });
	openFilesStore.applyModifications(modifications);
}