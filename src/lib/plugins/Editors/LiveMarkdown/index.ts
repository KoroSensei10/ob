import Editor from './LiveMarkdown.svelte';
import { definePlugin } from '$lib/plugins/PluginRegistry';
import type { PluginDefinition } from '$lib/plugins/types';

/**
 * Markdown editor plugin
 * Handles markdown files
 */
const liveMarkdownEditorPlugin: PluginDefinition = {
	id: 'markdown-editor',
	name: 'Markdown Editor',
	kind: 'editor',
	editor: {
		fileExtensions: ['.md', '.markdown'],
		editor: Editor
	},
	hooks: {
		onFileOpen: async (file) => {
			if (file.path.endsWith('.md') || file.path.endsWith('.markdown')) {
				console.log(`Markdown editor opened file: ${file.path}`);
			}
		}
	}
};

export default definePlugin(liveMarkdownEditorPlugin);