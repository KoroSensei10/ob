import { getFileContent } from '$lib/files.remote';
import { viewportStore } from './Viewport.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';


class OpenFilesStore {
	openFiles: FileEntry[] = $state([]);
	activeFilePath: string | null = $state(null);
	activeFile: FileEntry | null = $derived.by(() => {
		if (this.activeFilePath) {
			return this.openFiles.find(f => f.path === this.activeFilePath) || null;
		}
		return null;
	});

	async openFile(file: FileEntry) {
		// todo: save file before switch
		await this.#getFileContent(file);
		if (!this.openFiles.find(f => f.path === file.path)) {
			this.openFiles.push(file);
		}
		this.activeFilePath = file.path;

		// Ui update
		viewportStore.isMobileSidebarOpen = false;
	}
	closeFile(file: FileEntry) {
		if (this.activeFilePath === file.path) {
			this.activeFilePath = this.openFiles.length > 0 ? this.openFiles[this.openFiles.length - 1].path : null;
		}
		this.openFiles = this.openFiles.filter(f => f.path !== file.path);
	}
	async #getFileContent(entry: FileEntry) {
		entry.content = await getFileContent(entry.path);
	}

	applyChanges(changes: EntryModification[]) {
		for (const change of changes) {
			if (change.type === 'moved') {
				const files = this.openFiles.filter(f => f.path.startsWith(change.oldPath));
				for (const file of files) {
					const relativePath = file.path.slice(change.oldPath.length);
					const newPath = change.newPath + relativePath;
					file.path = newPath;
					if (this.activeFilePath?.startsWith(change.oldPath)) {
						this.activeFilePath = newPath;
					}
				}
			}
		}
	}
}

export const openFilesStore = new OpenFilesStore();