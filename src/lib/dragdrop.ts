import { invalidate } from '$app/navigation';
import type { FolderEntry } from '$types/files';
import { moveFile } from './files.remote';

export async function handleDrop(e: DragEvent, entry: FolderEntry, callback: (response?: Promise<Response>) => Promise<void>) {
	e.preventDefault();
	e.stopImmediatePropagation();
	const data = JSON.parse(e.dataTransfer?.getData('json') ?? '{}');

	if (data.filePath) {
		await moveFile({
			entryPath: data.filePath,
			destFolder: entry.path
		});
		await invalidate('files');
		await callback();
	}
}