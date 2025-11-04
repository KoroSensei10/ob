import { definePlugin } from '$core/PluginRegistry.svelte';
import type { PluginDefinition } from '$core/types';
import Wrapper from './Wrapper.svelte';

/**
 * Markdown editor plugin
 * Handles markdown files
 */
const excalidrawPlugin: PluginDefinition = {
	id: 'excalidraw-editor',
	name: 'Excalidraw Editor',
	kind: 'editor',
	editor: {
		fileExtensions: ['.excalidraw'],
		editor: Wrapper
	},
};

export default definePlugin(excalidrawPlugin);