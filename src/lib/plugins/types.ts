import type { Component } from 'svelte';
import type { FileEntry } from '$types/files';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginHooks } from './HookManager';
import type { LightCoreAPI } from '../core/LightCoreAPI.svelte';

export type PluginKind = 'editor' | 'core' | 'ui' | 'service';

export type InitContext = {
	coreAPI: CoreAPI;
};

export type PluginDefinition<T extends PluginKind = PluginKind> = {
	id: string;
	name: string;
	kind: T;
	init?(ctx: InitContext): Promise<void>;
	destroy?(): Promise<void>;

  hooks?: Partial<PluginHooks>;
  editor: T extends 'editor' ? EditorPlugin : never;
};

export interface EditorPlugin {
	fileExtensions: string[];
	editor: Component<EditorPluginProps>;
}

/**
 * Props passed to editor plugin components
 */
export interface EditorPluginProps {
	file: FileEntry;
	coreAPI: LightCoreAPI;
	handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
}