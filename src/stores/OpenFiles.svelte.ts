import { getFileContent } from '$lib/files.remote';
import type { FileEntry } from '$types/files';
import { getContext, setContext } from 'svelte';
import { viewportStore } from './Viewport.svelte';


export class OpenFilesStore {
	private _openFiles: FileEntry[];
	private _activeFile: FileEntry | null;

	constructor() {
		this._openFiles = $state([]);
		this._activeFile = $state(null);
	}
	get openFiles(): FileEntry[] {
		return this._openFiles;
	}
	get activeFile(): FileEntry | null {
		return this._activeFile;
	}
	set activeFile(file: FileEntry | null) {
		this._activeFile = file;
	}
	#addOpenFile(file: FileEntry) {
		if (!this._openFiles.find(f => f.path === file.path)) {
			this._openFiles.push(file);
		}
		this._activeFile = file;
	}
	closeFile(file: FileEntry) {
		this._openFiles = this._openFiles.filter(f => f.path !== file.path);
		if (this._activeFile?.path === file.path) {
			this._activeFile = this._openFiles.length > 0 ? this._openFiles[this._openFiles.length - 1] : null;
		}
	}
	async getFileContent(entry: FileEntry) {
		// TODO save current file before switching
		const existingFile = this.openFiles.find((f) => f.path === entry.path);
		if (existingFile && existingFile.content) {
			this._activeFile = existingFile;
		} else {
			entry.content = await getFileContent('./data/' + entry.path);
			this.#addOpenFile(entry);
		}
		viewportStore.isMobileSidebarOpen = false;
	}
}

export function setOpenFilesContext(store: OpenFilesStore) {
	setContext<OpenFilesStore>('activeFileStore', store);
}

export function getOpenFilesContext(): OpenFilesStore {
	return getContext<OpenFilesStore>('activeFileStore');
}