import { moveEntry } from '$lib/remotes/files.remote';
import { dragStore } from '$stores/Drag.svelte';
import { openFilesStore } from '$stores/OpenFiles.svelte';
import type { FileTree, FolderEntry } from '$types/files';

export async function dropAndMove(folder: FolderEntry, callback?: (response?: Promise<Response>) => Promise<void>) {
	const data = dragStore.drop() as FileTree;
	if (data.path) {
		const changes = await moveEntry({
			entryPath: data.path,
			destFolder: folder.path
		});
		await callback?.();
		openFilesStore.applyModifications(changes);
	}
}