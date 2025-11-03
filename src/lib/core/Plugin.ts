import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginHooks } from './HookManager';
import type { Component } from 'svelte';
import type { FileEntry } from '$types/files';

export type PluginKind = 'editor' | 'core' | 'ui' | 'service';

/**
 * Base Plugin class that all plugins should extend
 */
export abstract class Plugin {
	abstract readonly id: string;
	abstract readonly name: string;
	abstract readonly kind: PluginKind;

	protected coreAPI?: CoreAPI;

	/**
	 * Initialize the plugin
	 * @param coreAPI - The core API instance
	 */
	async init(coreAPI: CoreAPI): Promise<void> {
		this.coreAPI = coreAPI;
	}

	/**
	 * Destroy/cleanup the plugin
	 */
	async destroy(): Promise<void> {
		// Override in subclass if needed
	}

	/**
	 * Get plugin hooks
	 */
	getHooks(): Partial<PluginHooks> {
		return {};
	}
}

/**
 * Editor plugin interface
 */
export interface EditorPluginConfig {
	fileExtensions: string[];
	editor: Component<EditorPluginProps>;
}

/**
 * Props passed to editor plugin components
 */
export interface EditorPluginProps {
	file: FileEntry;
	coreAPI: CoreAPI;
	handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
}

/**
 * Base class for editor plugins
 */
export abstract class EditorPlugin extends Plugin {
	readonly kind = 'editor' as const;
	abstract readonly editorConfig: EditorPluginConfig;

	getEditorConfig(): EditorPluginConfig {
		return this.editorConfig;
	}
}

/**
 * Base class for service plugins
 */
export abstract class ServicePlugin extends Plugin {
	readonly kind = 'service' as const;
}

/**
 * Base class for core plugins
 */
export abstract class CorePlugin extends Plugin {
	readonly kind = 'core' as const;
}

/**
 * Base class for UI plugins
 */
export abstract class UIPlugin extends Plugin {
	readonly kind = 'ui' as const;
}
