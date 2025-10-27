import { getFileContent } from '$lib/remotes/files.remote';
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
	closeFile(file: { path: string }) {
		this.openFiles = this.openFiles.filter(f => f.path !== file.path);
		if (this.activeFilePath === file.path) {
			this.activeFilePath = this.openFiles.length > 0 ? this.openFiles[0].path : null;
		}
	}
	async #getFileContent(entry: FileEntry) {
		entry.content = await getFileContent(entry.path);
	}

	/**
	 * Apply server fs modifications to open files since the client don't knows
	 * about moved/renamed files.
	 */
	applyModifications(changes: EntryModification[]) {
		for (const change of changes) {
			if (change.type === 'moved' || (change.type === 'renamed' && change.isFolder)) {
				const files = this.openFiles.filter(f => f.path.startsWith(change.oldPath));
				for (const file of files) {
					const relativePath = file.path.slice(change.oldPath.length);
					const newPath = change.newPath + relativePath;
					file.path = newPath;
					if (this.activeFilePath?.startsWith(change.oldPath)) {
						this.activeFilePath = newPath;
					}
				}
			} else if (change.type === 'renamed') {
				const file = this.openFiles.find(f => f.path === change.oldPath);
				const fileName = change.newPath.split('/').pop();
				if (file && fileName) {
					file.path = change.newPath;
					file.name = fileName;
					if (this.activeFilePath === change.oldPath) {
						this.activeFilePath = change.newPath;
					}
				}
			} else if (change.type === 'removed') {
				if (change.isFolder) {
					if (this.activeFilePath?.startsWith(change.oldPath)) {
						this.closeFile({ path: this.activeFilePath });
					}
					this.openFiles = this.openFiles.filter(f => !f.path.startsWith(change.oldPath));
				} else {
					if (this.activeFilePath === change.oldPath) {
						this.closeFile({ path: this.activeFilePath });
					}
					this.openFiles = this.openFiles.filter(f => f.path !== change.oldPath);
				}
			}
		}
	}
}

export const openFilesStore = new OpenFilesStore();