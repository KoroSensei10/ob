import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { HookManager } from './HookManager';
import { Plugin, type PluginKind } from './Plugin';

export class PluginRegistry {
	private plugins: Map<string, Plugin> = new Map();
	readonly core: CoreAPI;
	readonly hookManager: HookManager;

	constructor(core: CoreAPI, hookManager: HookManager) {
		this.core = core;
		this.hookManager = hookManager;
	}

	async init(): Promise<void> {
		// Load plugins from external plugins directory
		// This will be dynamically loaded from the plugins directory
		await this.loadExternalPlugins();
	}

	private async loadExternalPlugins(): Promise<void> {
		// For now, we'll import from the plugins directory
		// In the future, this could be made more dynamic
		try {
			// Import all plugin modules from the plugins directory
			const pluginModules = import.meta.glob('/plugins/**/*.ts', { eager: false });
			
			for (const path in pluginModules) {
				try {
					const module = await pluginModules[path]() as { default?: new () => Plugin };
					if (module.default && typeof module.default === 'function') {
						const PluginClass = module.default;
						const plugin = new PluginClass();
						await this.register(plugin);
					}
				} catch (error) {
					console.error(`Failed to load plugin from ${path}:`, error);
				}
			}
		} catch (error) {
			console.error('Failed to load external plugins:', error);
		}
	}

	async register(plugin: Plugin): Promise<void> {
		if (this.plugins.has(plugin.id)) {
			console.warn(`Plugin with id '${plugin.id}' is already registered. Overwriting.`);
		}
		this.plugins.set(plugin.id, plugin);

		// Initialize plugin
		await plugin.init(this.core);

		// Register hooks
		const hooks = plugin.getHooks();
		for (const hookName in hooks) {
			const hook = hookName as keyof typeof hooks;
			const handler = hooks[hook];
			if (handler) {
				this.hookManager.register(hook, handler);
			}
		}
	}
	
	async unregister(pluginId: string): Promise<void> {
		const plugin = this.plugins.get(pluginId);
		if (plugin) {
			await plugin.destroy();
			this.plugins.delete(pluginId);
		}
	}
	
	getPlugin(pluginId: string): Plugin | undefined {
		return this.plugins.get(pluginId);
	}
	
	getAllPlugins(): Plugin[] {
		return Array.from(this.plugins.values());
	}

	getPluginsByKind<T extends PluginKind>(kind: T): Plugin[] {
		return Array.from(this.plugins.values())
			.filter(plugin => plugin.kind === kind);
	}
}
