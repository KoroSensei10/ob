import { moveEntry, removeEntry, renameEntry } from '$lib/remotes/files.remote';

import type { OpenFilesStore } from '$core/internal/stores/OpenFiles.svelte';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FolderEntry } from '$types/files';

export class EntryAPI {
	// eslint-disable-next-line no-unused-private-class-members
	readonly #core: CoreAPI;
	readonly #openFilesStore: OpenFilesStore;

	constructor(core: CoreAPI, openFilesStore: OpenFilesStore) {
		this.#core = core;
		this.#openFilesStore = openFilesStore;
	}

	/**
	 * Remove a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
	removeEntry = async (entryPath: string) => {
		const modifications = await removeEntry({ entryPath: entryPath });
		await this.#openFilesStore.syncModifications(modifications);
	};
	/**
	 * Rename a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
	renameEntry = async (entryPath: string, newName: string) => {
		const modifications = await renameEntry({ entryPath: entryPath, newName: newName });
		await this.#openFilesStore.syncModifications(modifications);
	};
	/**
	 * Move a file or folder entry to a destination folder
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
	moveEntry = async (entryPath: string, folderEntry: FolderEntry) => {
		const modifications = await moveEntry({ entryPath: entryPath, destFolder: folderEntry.path });
		await this.#openFilesStore.syncModifications(modifications);
	};
}