import { FileAPI } from './internal/FileAPI.svelte';

import { OpenFilesStore } from './internal/stores/OpenFiles.svelte';
import { EntryAPI } from './internal/EntryAPI.svelte';
import { LightCoreAPI } from './LightCoreAPI.svelte';
import { PluginRegistry } from '$lib/plugins/PluginRegistry';
import { HookManager } from '$lib/plugins/HookManager';


class CoreAPI {
	readonly #openFilesStore: OpenFilesStore;
	readonly #hookManager: HookManager;
	readonly pluginRegistry: PluginRegistry;
	readonly lightCoreAPI: LightCoreAPI;
	readonly files: FileAPI;
	readonly entries: EntryAPI;

	constructor() {
		// Internal
		this.#openFilesStore = new OpenFilesStore(this);
		this.#hookManager = new HookManager();

		this.pluginRegistry = new PluginRegistry(this, this.#hookManager);
		this.files = new FileAPI(this, this.#openFilesStore, this.#hookManager);
		this.entries = new EntryAPI(this, this.#openFilesStore);
		this.lightCoreAPI = new LightCoreAPI(this);
	}
}

export type { CoreAPI };
export const coreAPI = new CoreAPI();