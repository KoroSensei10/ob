import type { FileEntry } from '$types/files';

export interface PluginHooks {
	onFileOpen?(file: FileEntry): Promise<void>;
	onFileSave?(file: FileEntry): Promise<void>;
	onAppStart?(): Promise<void>;
}

type HookMap = { [K in keyof PluginHooks]?: Set<PluginHooks[K]> };

export class HookManager {
	#hooks: HookMap = {};

	register<K extends keyof PluginHooks>(hook: K, handler: PluginHooks[K]) {
		if (!this.#hooks[hook]) this.#hooks[hook] = new Set() as HookMap[K];
		this.#hooks[hook]!.add(handler);
	}

	async trigger<K extends keyof PluginHooks>(hook: K, ...args: Parameters<NonNullable<PluginHooks[K]>>) {
		for (const fn of this.#hooks[hook] ?? []) {
			// @ts-expect-error TypeScript can't infer that fn is not undefined here
			await fn?.(...args);
		}
	}
}
