import type { EditorPlugin } from './types';
import { pluginRegistry } from './registry';
import TextEditor from './editors/TextEditor.svelte';
import MarkdownEditor from './editors/MarkdownEditor.svelte';

/**
 * Default text editor plugin
 * Handles all file types as a fallback
 */
const textEditorPlugin: EditorPlugin = {
	id: 'text-editor',
	name: 'Text Editor',
	fileExtensions: ['*'], // Wildcard means it handles all files
	priority: -1, // Low priority so other plugins take precedence
	component: TextEditor
};

/**
 * Markdown editor plugin
 * Handles markdown files
 */
const markdownEditorPlugin: EditorPlugin = {
	id: 'markdown-editor',
	name: 'Markdown Editor',
	fileExtensions: ['.md', '.markdown'],
	priority: 10, // Higher priority than default text editor
	component: MarkdownEditor
};

/**
 * Register default plugins
 */
export function registerDefaultPlugins(): void {
	pluginRegistry.register(textEditorPlugin);
	pluginRegistry.register(markdownEditorPlugin);
}

/**
 * Export the plugin registry for use throughout the application
 */
export { pluginRegistry } from './registry';
export type { EditorPlugin, EditorPluginProps, PluginRegistry } from './types';
