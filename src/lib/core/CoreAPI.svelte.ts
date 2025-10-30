import { FileAPI } from './internal/FileAPI.svelte';

import { OpenFilesStore } from './internal/stores/OpenFiles.svelte';
import { EntryAPI } from './internal/EntryAPI.svelte';


class CoreAPI {
	readonly #openFilesStore: OpenFilesStore;
	readonly files: FileAPI;
	readonly entries: EntryAPI;

	constructor() {
		this.#openFilesStore = new OpenFilesStore(this);
		this.files = new FileAPI(this, this.#openFilesStore);
		this.entries = new EntryAPI(this, this.#openFilesStore);
	}
}

export type { CoreAPI };
export const coreAPI = new CoreAPI();