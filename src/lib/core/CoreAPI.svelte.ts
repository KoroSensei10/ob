import { getFileContent, moveEntry, removeEntry, renameEntry, writeFileContent } from '$lib/remotes/files.remote';

import type { FileEntry, FolderEntry } from '$types/files';
import type { EntryModification } from '$types/modification';

/**
 * Store managing for open files in the client (tabs).
 * * Will evolve into "TabsStore", with more features (last modification, settings tabs, plugins tabs, etc...).
 */
class OpenFilesStore {
	openFiles: FileEntry[] = $state([]);
	activeFilePath: string | null = $state(null);
	activeFile: FileEntry | null = $derived.by(() => {
		if (this.activeFilePath) {
			return this.openFiles.find(f => f.path === this.activeFilePath) || null;
		}
		return null;
	});

	coreAPI: CoreAPI;
	constructor(coreAPI: CoreAPI) {
		this.coreAPI = coreAPI;
	}

	async openFile(file: FileEntry) {
		// todo: save file before switch if auto save is on
		if (!this.openFiles.find(f => f.path === file.path)) {
			this.openFiles.push(file);
		}
		this.activeFilePath = file.path;
	}
	async closeFile(file: { path: string }) {
		this.openFiles = this.openFiles.filter(f => f.path !== file.path);
		if (this.activeFilePath === file.path && this.openFiles.length > 0) {
			await this.coreAPI.files.openFile(this.openFiles[0]);
			this.activeFilePath = this.openFiles.length > 0 ? this.openFiles[0].path : null;
		}
		this.openFiles = this.openFiles.filter(f => f.path !== file.path);
		if (this.activeFilePath === file.path) {
			this.activeFilePath = this.openFiles.length > 0 ? this.openFiles[0].path : null;
		}
	}

	/**
	 * Apply server fs modifications to open files since the client don't knows
	 * about moved/renamed files.
	 */
	async syncModifications(changes: EntryModification[]) {
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
						await this.closeFile({ path: this.activeFilePath });
					}
					this.openFiles = this.openFiles.filter(f => !f.path.startsWith(change.oldPath));
				} else {
					if (this.activeFilePath === change.oldPath) {
						await this.closeFile({ path: this.activeFilePath });
					}
					this.openFiles = this.openFiles.filter(f => f.path !== change.oldPath);
				}
			}
		}
	}
}

class CoreAPI {
	#openFilesStore: OpenFilesStore;

	constructor() {
		this.#openFilesStore = new OpenFilesStore(this);
	}

	files = {
		/**
		 * Read file content from disk.
		 * No update of the FileEntry content in the store.
		 */
		getFileContent: async (file: FileEntry): Promise<string> => {
			return await getFileContent(file.path);
		},
		/**
		 * One-way writing file content to disk.
		 * No update of the FileEntry content in the store.
		 * If needed, the caller should update it with:
		 * @see {@linkcode CoreAPI.files.getFileContent}
		 * @see {@linkcode CoreAPI.files.openFile}
		 */
		writeFileContent: async (file: FileEntry, content: string): Promise<void> => {
			await writeFileContent({ filePath: file.path, content });
		},
		/**
		 * Open a file in the editor (load content and add to open files).
		 * @fires {@linkcode CoreAPI.files.getOpenFiles}
		 * @fires {@linkcode CoreAPI.files.getActiveFile}
		 */
		openFile: async (file: FileEntry) => {
			file.content = await this.files.getFileContent(file);
			await this.#openFilesStore.openFile(file);
		},
		/**
		 * Close an opened file
		 * @fires {@linkcode CoreAPI.files.getOpenFiles}
		 * @fires {@linkcode CoreAPI.files.getActiveFile}
		 */
		closeFile: async (file: { path: string }): Promise<void> => {
			await this.#openFilesStore.closeFile(file);
		},
		/**
		 * Get the list of currently opened files
		 * @reactive
		 */
		getOpenFiles: (): FileEntry[] => {
			return this.#openFilesStore.openFiles;
		},
		/**
		 * Get the currently active file
		 * @reactive
		 */
		getActiveFile: (): FileEntry | null => {
			return this.#openFilesStore.activeFile;
		}
	} as const;

	entries = {
		/**
		 * Remove a file or folder entry
		 * @fires {@linkcode CoreAPI.files.getOpenFiles}
		 * @fires {@linkcode CoreAPI.files.getActiveFile}
		 */
		removeEntry: async (entryPath: string) => {
			const modifications = await removeEntry({ entryPath: entryPath });
			await this.#openFilesStore.syncModifications(modifications);
		},
		/**
		 * Rename a file or folder entry
		 * @fires {@linkcode CoreAPI.files.getOpenFiles}
		 * @fires {@linkcode CoreAPI.files.getActiveFile}
		 */
		renameEntry: async (entryPath: string, newName: string) => {
			const modifications = await renameEntry({ entryPath: entryPath, newName: newName });
			await this.#openFilesStore.syncModifications(modifications);
		},
		/**
		 * Move a file or folder entry to a destination folder
		 * @fires {@linkcode CoreAPI.files.getOpenFiles}
		 * @fires {@linkcode CoreAPI.files.getActiveFile}
		 */
		moveEntry: async (entryPath: string, folderEntry: FolderEntry) => {
			const modifications = await moveEntry({ entryPath: entryPath, destFolder: folderEntry.path });
			await this.#openFilesStore.syncModifications(modifications);
		}
	} as const;
}

export const coreAPI = new CoreAPI();