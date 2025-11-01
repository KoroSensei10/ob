import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition, PluginKind } from './types';

import * as defaultPlugins from './Editors';
import type { HookManager } from './HookManager';

export class PluginRegistry {
	private plugins: Map<string, PluginDefinition<PluginKind>> = new Map();
	readonly core: CoreAPI;
	readonly hookManager: HookManager;

	constructor(core: CoreAPI, hookManager: HookManager) {
		this.core = core;
		this.hookManager = hookManager;
	}

	async init(): Promise<void> {
		// Register default plugins
		for (const pluginKey in defaultPlugins) {
			const plugin = (defaultPlugins as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}
	}

	register(plugin: PluginDefinition): void {
		if (this.plugins.has(plugin.id)) {
			console.warn(`Plugin with id '${plugin.id}' is already registered. Overwriting.`);
		}
		this.plugins.set(plugin.id, plugin);

		// Initialize plugin
		plugin.init?.(this.core);
		for (const hookName in plugin.hooks) {
			const hook = hookName as keyof typeof plugin.hooks;
			const handler = plugin.hooks[hook];
			if (handler) {
				this.hookManager.register(hook, handler);
			}
		}
	}
	
	unregister(pluginId: string): void {
		this.plugins.delete(pluginId);
	}
	
	getPlugin(pluginId: string): PluginDefinition | undefined {
		return this.plugins.get(pluginId);
	}
	
	getAllPlugins(): PluginDefinition[] {
		return Array.from(this.plugins.values());
	}

	getPluginsByKind<T extends PluginKind>(kind: T): PluginDefinition<T>[] {
		return Array.from(this.plugins.values())
			.filter(plugin => plugin.kind === kind)
			.map(plugin => plugin as PluginDefinition<T>);
	}
}

export function definePlugin(plugin: PluginDefinition): PluginDefinition {
	return plugin;
}