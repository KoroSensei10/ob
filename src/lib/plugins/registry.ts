import type { EditorPlugin, PluginRegistry as IPluginRegistry } from './types';
import type { FileEntry } from '$types/files';

/**
 * Implementation of the plugin registry
 */
export class PluginRegistry implements IPluginRegistry {
	private plugins: Map<string, EditorPlugin> = new Map();
	
	/**
	 * Register a new editor plugin
	 */
	register(plugin: EditorPlugin): void {
		if (this.plugins.has(plugin.id)) {
			console.warn(`Plugin with id '${plugin.id}' is already registered. Overwriting.`);
		}
		this.plugins.set(plugin.id, plugin);
	}
	
	/**
	 * Unregister an editor plugin
	 */
	unregister(pluginId: string): void {
		this.plugins.delete(pluginId);
	}
	
	/**
	 * Get a plugin by ID
	 */
	getPlugin(pluginId: string): EditorPlugin | undefined {
		return this.plugins.get(pluginId);
	}
	
	/**
	 * Get all registered plugins
	 */
	getAllPlugins(): EditorPlugin[] {
		return Array.from(this.plugins.values());
	}
	
	/**
	 * Find the best plugin for a given file
	 * Returns the highest priority plugin that can handle the file
	 */
	resolvePlugin(file: FileEntry): EditorPlugin | undefined {
		const fileName = file.name.toLowerCase();
		
		// Find all plugins that can handle this file
		const candidates: EditorPlugin[] = [];
		
		for (const plugin of this.plugins.values()) {
			// Check custom canHandle function if provided
			if (plugin.canHandle && plugin.canHandle(file)) {
				candidates.push(plugin);
				continue;
			}
			
			// Check file extensions
			if (plugin.fileExtensions.some(ext => {
				// Handle wildcard
				if (ext === '*') {
					return true;
				}
				return fileName.endsWith(ext.toLowerCase());
			})) {
				candidates.push(plugin);
			}
		}
		
		// Sort by priority (highest first)
		candidates.sort((a, b) => (b.priority || 0) - (a.priority || 0));
		
		// Return the highest priority plugin, or undefined if none found
		return candidates[0];
	}
	
	/**
	 * Get the file extension from a filename
	 */
	private getFileExtension(filename: string): string {
		const lastDot = filename.lastIndexOf('.');
		return lastDot === -1 ? '' : filename.slice(lastDot);
	}
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new PluginRegistry();
