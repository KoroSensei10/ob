import { type CoreAPI } from '../../CoreAPI.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';

/**
 * Store managing for open files in the client (tabs).
 * * Will evolve into "TabsStore", with more features (last modification, settings tabs, plugins tabs, etc...).
 * @internal You should not use this store directly, but use {@linkcode CoreAPI} instead.
 */
export class OpenFilesStore {
	openFiles: FileEntry[] = $state([]);
	activeFilePath: string | null = $state(null);
	activeFile: FileEntry | null = $derived.by(() => {
		if (this.activeFilePath) {
			return this.openFiles.find(f => f.path === this.activeFilePath) || null;
		}
		return null;
	});

	constructor(private coreAPI: CoreAPI) {}

	async openFile(file: FileEntry) {
		// todo: save file before switch if auto save is on
		if (!this.openFiles.find(f => f.path === file.path)) {
			this.openFiles.push(file);
		}
		this.activeFilePath = file.path;
	}
	async closeFile(file: { path: string }) {
		const afterFiles = this.openFiles.filter(f => f.path !== file.path);
		if (this.activeFilePath === file.path) {
			const newActiveFile = afterFiles.length > 0 ? afterFiles[0] : null;
			if (newActiveFile) {
				await this.coreAPI.files.openFile(newActiveFile);
			}
		}
		this.openFiles = afterFiles;
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