import type { Component } from 'svelte';
import type { FileEntry } from '$types/files';

/**
 * Defines the interface for an editor plugin
 */
export interface EditorPlugin {
	/**
	 * Unique identifier for the plugin
	 */
	id: string;
	
	/**
	 * Human-readable name of the plugin
	 */
	name: string;
	
	/**
	 * File extensions this plugin can handle (e.g., ['.md', '.markdown'])
	 */
	fileExtensions: string[];
	
	/**
	 * Priority for this plugin (higher priority plugins are preferred)
	 * Default is 0
	 */
	priority?: number;
	
	/**
	 * The Svelte component that renders the editor
	 */
	component: Component<EditorPluginProps>;
	
	/**
	 * Optional validation function to determine if this plugin can handle a file
	 */
	canHandle?: (file: FileEntry) => boolean;
}

/**
 * Props passed to editor plugin components
 */
export interface EditorPluginProps {
	file: FileEntry;
	handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
}

/**
 * Plugin registry configuration
 */
export interface PluginRegistry {
	/**
	 * Register a new editor plugin
	 */
	register(plugin: EditorPlugin): void;
	
	/**
	 * Unregister an editor plugin
	 */
	unregister(pluginId: string): void;
	
	/**
	 * Get a plugin by ID
	 */
	getPlugin(pluginId: string): EditorPlugin | undefined;
	
	/**
	 * Get all registered plugins
	 */
	getAllPlugins(): EditorPlugin[];
	
	/**
	 * Find the best plugin for a given file
	 */
	resolvePlugin(file: FileEntry): EditorPlugin | undefined;
}
