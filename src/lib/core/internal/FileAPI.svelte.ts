import { getFileContent, writeFileContent } from '$lib/remotes/files.remote';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FileEntry } from '$types/files';
import type { OpenFilesStore } from '$core/internal/stores/OpenFiles.svelte';
import type { HookManager } from '$lib/plugins/HookManager';

/**
 * @class FileAPI
 * @internal You should not use this API directly, but use {@linkcode CoreAPI.files} instead.
 */
export class FileAPI {
	readonly #openFilesStore: OpenFilesStore;
	// eslint-disable-next-line no-unused-private-class-members
	readonly #core: CoreAPI;
	readonly #hookManager: HookManager;

	constructor(core: CoreAPI, openFilesStore: OpenFilesStore, hookManager: HookManager) {
		this.#openFilesStore = openFilesStore;
		this.#core = core;
		this.#hookManager = hookManager;
	}

	/**
	 * Read file content from disk.
	 * No update of the FileEntry content in the store.
	 */
	getFileContent = async (file: FileEntry): Promise<string> => {
		return await getFileContent(file.path);
	};
	/**
	 * One-way writing file content to disk.
	 * No update of the FileEntry content in the store.
	 * If needed, the caller should update it with {@linkcode FileAPI.getFileContent}
	 * or {@linkcode FileAPI.openFile}.
	 */
	writeFileContent = async (file: FileEntry, content: string): Promise<void> => {
		await writeFileContent({ filePath: file.path, content });
		this.#hookManager.trigger('onFileSave', file);
	};
	/**
	 * Load content of the file and add it to opened files
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
	openFile = async (file: FileEntry) => {
		file.content = await this.getFileContent(file);
		await this.#openFilesStore.openFile(file);
		this.#hookManager.trigger('onFileOpen', file);
	};
	/**
	 * Close an opened file
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
	closeFile = async (file: { path: string }): Promise<void> => {
		await this.#openFilesStore.closeFile(file);
	};
	/**
	 * Get the list of currently opened files
	 * @reactive
	 */
	getOpenFiles = (): FileEntry[] => {
		return this.#openFilesStore.openFiles;
	};
	/**
	 * Get the currently active file
	 * @reactive
	 */
	getActiveFile = (): FileEntry | null => {
		return this.#openFilesStore.activeFile;
	};	
}