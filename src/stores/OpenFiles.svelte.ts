import { getFileContent } from '$lib/files.remote';
import { getContext, setContext } from 'svelte';
import { viewportStore } from './Viewport.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';


export class OpenFilesStore {
	openFiles: FileEntry[] = $state([]);
	activeFilePath: string | null = $state(null);
	activeFile: FileEntry | null = $derived.by(() => {
		if (this.activeFilePath) {
			return this.openFiles.find(f => f.path === this.activeFilePath) || null;
		}
		return null;
	});

	#addOpenFile(file: FileEntry) {
		if (!this.openFiles.find(f => f.path === file.path)) {
			this.openFiles.push(file);
		}
		this.activeFilePath = file.path;
	}
	closeFile(file: FileEntry) {
		if (this.activeFilePath === file.path) {
			this.activeFilePath = this.openFiles.length > 0 ? this.openFiles[this.openFiles.length - 1].path : null;
		}
		this.openFiles = this.openFiles.filter(f => f.path !== file.path);
	}
	async getFileContent(entry: FileEntry) {
		// TODO save current file before switching
		const existingFile = this.openFiles.find((f) => f.path === entry.path);
		if (existingFile && existingFile.content) {
			this.activeFilePath = existingFile.path;
		} else {
			entry.content = await getFileContent(entry.path);
			this.#addOpenFile(entry);
		}
		viewportStore.isMobileSidebarOpen = false;
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

export function setOpenFilesContext(store: OpenFilesStore) {
	setContext<OpenFilesStore>('activeFileStore', store);
}

export function getOpenFilesContext(): OpenFilesStore {
	return getContext<OpenFilesStore>('activeFileStore');
}