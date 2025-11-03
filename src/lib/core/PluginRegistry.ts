import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition, PluginKind } from './types';
import type { HookManager } from './HookManager';

export class PluginRegistry {
	private plugins: Map<string, PluginDefinition> = new Map();
	readonly core: CoreAPI;
	readonly hookManager: HookManager;

	constructor(core: CoreAPI, hookManager: HookManager) {
		this.core = core;
		this.hookManager = hookManager;
	}

	async init(): Promise<void> {
		// Register default editors and services

		const defaultEditors = await import('$plugins/Editors');
		for (const pluginKey in defaultEditors) {
			const plugin = (defaultEditors as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}
		const defaultServices = await import('$plugins/Services');
		for (const pluginKey in defaultServices) {
			const plugin = (defaultServices as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}
		const defaultThemes = await import('$plugins/Themes');
		for (const pluginKey in defaultThemes) {
			const plugin = (defaultThemes as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}
		
		// Apply default theme
		this.core.theme.applyTheme('default-light-theme');
	}

	register(plugin: PluginDefinition): void {
		if (this.plugins.has(plugin.id)) {
			console.warn(`Plugin with id '${plugin.id}' is already registered. Overwriting.`);
		}
		this.plugins.set(plugin.id, plugin);

		// Register theme plugins with ThemeAPI
		if (plugin.kind === 'theme') {
			this.core.theme.registerTheme(plugin);
		}

		// Initialize plugin
		plugin.init?.({ coreAPI: this.core });
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

	getPluginsByKind<T extends PluginKind>(kind: T): PluginDefinition[] {
		return Array.from(this.plugins.values())
			.filter(plugin => plugin.kind === kind)
			.map(plugin => plugin);
	}
}

export function definePlugin(plugin: PluginDefinition): PluginDefinition {
	return plugin;
}