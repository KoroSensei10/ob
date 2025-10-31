# Editor Plugin System

This plugin system allows you to create custom editors for different file types in the application.

## Overview

The plugin system provides a flexible way to handle multiple types of views for editing documents. Each plugin is responsible for rendering and managing content for specific file types.

## Architecture

The plugin system consists of:

1. **Plugin Types** (`types.ts`) - Defines the interfaces for editor plugins
2. **Plugin Registry** (`registry.ts`) - Manages plugin registration and resolution
3. **Plugin Implementations** (`editors/`) - Individual editor components

## Using the Plugin System

### Registering a Plugin

Plugins are automatically registered when the application starts. Default plugins include:
- Text Editor (fallback for all file types)
- Markdown Editor (for `.md` and `.markdown` files)

### Creating a Custom Plugin

To create a custom editor plugin:

1. Create a new Svelte component in `src/lib/plugins/editors/`
2. Register your plugin in `src/lib/plugins/index.ts`

#### Example: Creating a JSON Editor Plugin

**Step 1: Create the Editor Component**

```svelte
<!-- src/lib/plugins/editors/JsonEditor.svelte -->
<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { viewportStore } from '$stores/Viewport.svelte';
	import type { FileEntry } from '$types/files';

	const { getActiveFile } = coreAPI.files;

	type Props = {
		file: FileEntry;
		handleContentChange: (_e: Event, _file: FileEntry) => Promise<void>;
	};

	let { file = $bindable(), handleContentChange }: Props = $props();

	function focus(node: HTMLElement) {
		if (node && file.path === getActiveFile()?.path) {
			node.focus();
		}
	}
	
	// Format JSON on load
	let formattedContent = $derived(
		file.content ? formatJson(file.content) : ''
	);
	
	function formatJson(content: string): string {
		try {
			const parsed = JSON.parse(content);
			return JSON.stringify(parsed, null, 2);
		} catch {
			return content;
		}
	}
</script>

<textarea
	{@attach !viewportStore.isMobile && focus}
	bind:value={file.content}
	oninput={(e) => handleContentChange(e, file)}
	class:hidden={file.path !== getActiveFile()?.path}
	class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
			focus:outline-none focus:ring-0
			resize-none text-gray-200 placeholder-gray-500 shadow-sm"
	placeholder="Enter JSON..."
></textarea>
```

**Step 2: Register the Plugin**

```typescript
// src/lib/plugins/index.ts
import JsonEditor from './editors/JsonEditor.svelte';

const jsonEditorPlugin: EditorPlugin = {
	id: 'json-editor',
	name: 'JSON Editor',
	fileExtensions: ['.json'],
	priority: 10,
	component: JsonEditor
};

export function registerDefaultPlugins(): void {
	pluginRegistry.register(textEditorPlugin);
	pluginRegistry.register(markdownEditorPlugin);
	pluginRegistry.register(jsonEditorPlugin); // Add your plugin
}
```

## Plugin Interface

```typescript
export interface EditorPlugin {
	// Unique identifier for the plugin
	id: string;
	
	// Human-readable name of the plugin
	name: string;
	
	// File extensions this plugin can handle (e.g., ['.md', '.markdown'])
	fileExtensions: string[];
	
	// Priority for this plugin (higher priority plugins are preferred)
	// Default is 0
	priority?: number;
	
	// The Svelte component that renders the editor
	component: Component<EditorPluginProps>;
	
	// Optional validation function to determine if this plugin can handle a file
	canHandle?: (file: FileEntry) => boolean;
}
```

## Plugin Props

Your editor component will receive these props:

```typescript
export interface EditorPluginProps {
	file: FileEntry;
	handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
}
```

- `file`: The file entry being edited (bindable)
- `handleContentChange`: Function to call when content changes (for auto-save)

## Plugin Resolution

When a file is opened, the system:

1. Checks all registered plugins
2. Filters plugins that can handle the file (by extension or custom `canHandle` function)
3. Sorts by priority (highest first)
4. Returns the highest priority plugin

### Priority Rules

- Higher priority values take precedence
- Default text editor has priority `-1` (lowest)
- Markdown editor has priority `10`
- Wildcard extension `*` matches all files

### Custom File Handling

You can provide a custom `canHandle` function for more complex logic:

```typescript
const customPlugin: EditorPlugin = {
	id: 'custom-editor',
	name: 'Custom Editor',
	fileExtensions: [],
	component: CustomEditor,
	canHandle: (file) => {
		// Custom logic to determine if this plugin can handle the file
		return file.name.includes('special') || file.path.includes('/custom/');
	}
};
```

## Testing

The plugin system includes comprehensive tests in `registry.spec.ts`:

- Plugin registration and retrieval
- File type detection
- Priority-based resolution
- Custom `canHandle` functions
- Case-insensitive extension matching
- Wildcard extension support

Run tests with:
```bash
pnpm test:unit src/lib/plugins/registry.spec.ts
```

## Future Extensions

Potential enhancements:
- **Excalidraw Plugin**: For drawing diagrams (`.excalidraw` files)
- **PDF Viewer Plugin**: For viewing PDF files
- **Image Viewer Plugin**: For displaying images
- **Code Editor Plugin**: Enhanced code editing with syntax highlighting
- **Canvas Plugin**: For whiteboard-style notes

## API Reference

### PluginRegistry

```typescript
class PluginRegistry {
	// Register a new editor plugin
	register(plugin: EditorPlugin): void;
	
	// Unregister an editor plugin
	unregister(pluginId: string): void;
	
	// Get a plugin by ID
	getPlugin(pluginId: string): EditorPlugin | undefined;
	
	// Get all registered plugins
	getAllPlugins(): EditorPlugin[];
	
	// Find the best plugin for a given file
	resolvePlugin(file: FileEntry): EditorPlugin | undefined;
}
```

### Global Instance

Access the plugin registry throughout the application:

```typescript
import { pluginRegistry } from '$lib/plugins';

// Get all plugins
const plugins = pluginRegistry.getAllPlugins();

// Resolve plugin for a file
const plugin = pluginRegistry.resolvePlugin(file);
```
