import Editor from './LiveMarkdown.svelte';
import { definePlugin } from '$core/PluginRegistry';
import type { PluginDefinition } from '$core/types';

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
};

export default definePlugin(liveMarkdownEditorPlugin);