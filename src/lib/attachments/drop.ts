import { moveFile } from '../files.remote';
import { dragStore } from '$stores/Drag.svelte';
import type { FileTree, FolderEntry } from '$types/files';
import { OpenFilesStore } from '../../stores/OpenFiles.svelte';

export async function dropAndMove(openFilesStore: OpenFilesStore, folder: FolderEntry, callback?: (response?: Promise<Response>) => Promise<void>) {
	const data = dragStore.drop() as FileTree
	if (data.path) {
		const changes = await moveFile({
			entryPath: data.path,
			destFolder: folder.path
		});
		await callback?.();
		openFilesStore.applyChanges(changes);
	}
}