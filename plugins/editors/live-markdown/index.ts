import { EditorPlugin } from '../../../src/lib/core/Plugin';
import LiveMarkdownEditor from '../../../src/lib/plugins/Editors/LiveMarkdown/LiveMarkdown.svelte';

/**
 * Markdown editor plugin
 * Handles markdown files
 */
class LiveMarkdownEditorPlugin extends EditorPlugin {
	readonly id = 'markdown-editor';
	readonly name = 'Markdown Editor';
	readonly editorConfig = {
		fileExtensions: ['.md', '.markdown'],
		editor: LiveMarkdownEditor
	};
}

export default LiveMarkdownEditorPlugin;
