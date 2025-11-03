# Plugin System

This directory contains external plugins for the application. Plugins are now class-based and live outside the main application source code.

## Plugin Structure

Each plugin should be in its own directory and export a default class that extends one of the base plugin classes:

- `EditorPlugin` - For file editors
- `ServicePlugin` - For background services
- `CorePlugin` - For core functionality
- `UIPlugin` - For UI components

## Creating a New Plugin

### 1. Create Plugin Directory

Create a new directory for your plugin:
```bash
mkdir -p plugins/category/plugin-name
```

### 2. Create Plugin Class

Create an `index.ts` file that exports your plugin class:

```typescript
import { ServicePlugin } from '../../../src/lib/core/Plugin';
import type { CoreAPI } from '../../../src/lib/core/CoreAPI.svelte';

class MyPlugin extends ServicePlugin {
  readonly id = 'my-plugin';
  readonly name = 'My Plugin';

  async init(coreAPI: CoreAPI): Promise<void> {
    await super.init(coreAPI);
    // Initialize your plugin
  }

  getHooks(): Partial<PluginHooks> {
    return {
      async onFileOpen(file) {
        // Handle file open event
      }
    };
  }
}

export default MyPlugin;
```

### 3. Register Plugin

Add your plugin to the `PluginRegistry.loadExternalPlugins()` method in `/src/lib/core/PluginRegistry.ts`:

```typescript
const servicePlugins = [
  () => import('../../../plugins/services/logger/index'),
  () => import('../../../plugins/services/daily-note/index'),
  () => import('../../../plugins/category/my-plugin/index'), // Add your plugin
];
```

## Plugin Types

### Editor Plugin

Editor plugins handle specific file types:

```typescript
import { EditorPlugin } from '../../../src/lib/core/Plugin';
import MyEditor from './MyEditor.svelte';

class MyEditorPlugin extends EditorPlugin {
  readonly id = 'my-editor';
  readonly name = 'My Editor';
  readonly editorConfig = {
    fileExtensions: ['.ext'],
    editor: MyEditor
  };
}

export default MyEditorPlugin;
```

### Service Plugin

Service plugins provide background functionality:

```typescript
import { ServicePlugin } from '../../../src/lib/core/Plugin';
import type { CoreAPI } from '../../../src/lib/core/CoreAPI.svelte';
import type { PluginHooks } from '../../../src/lib/core/HookManager';

class MyServicePlugin extends ServicePlugin {
  readonly id = 'my-service';
  readonly name = 'My Service';

  async init(coreAPI: CoreAPI): Promise<void> {
    await super.init(coreAPI);
    // Register UI components if needed
    coreAPI.ui.registerSideBarComponent('my-service', MySideBar);
    coreAPI.ui.registerViewComponent('my-service', MyView);
  }

  getHooks(): Partial<PluginHooks> {
    return {
      async onFileOpen(file) {
        console.log(`File opened: ${file.name}`);
      }
    };
  }
}

export default MyServicePlugin;
```

## Available Hooks

Plugins can register handlers for the following hooks:

- `onFileOpen(file: FileEntry)` - Called when a file is opened
- `onFileSave(file: FileEntry)` - Called when a file is saved
- `onAppStart()` - Called when the app starts
- `onFileActive(file: FileEntry)` - Called when a file becomes active
- `onPluginTabActive(plugin: Plugin, tab: TabEntry)` - Called when a plugin tab becomes active
- `onTabClose(tab: TabEntry)` - Called when a tab is closed

## Core API

Plugins have access to the Core API through the `coreAPI` property:

- `coreAPI.files` - File operations
- `coreAPI.entries` - Entry operations
- `coreAPI.ui` - UI operations (register components)
- `coreAPI.pluginRegistry` - Plugin registry
- `coreAPI.tabs` - Tab management
- `coreAPI.activeTab` - Current active tab
- `coreAPI.openFile(file)` - Open a file
- `coreAPI.openPluginView(pluginId, title)` - Open a plugin view
- `coreAPI.activateTab(tabId)` - Activate a tab
- `coreAPI.closeTab(tabId)` - Close a tab
- `coreAPI.createFile(filePath)` - Create a new file
- `coreAPI.createAndOpenFile(filePath)` - Create and open a new file

## Examples

See the existing plugins for examples:

- **Editor Plugin**: `/plugins/editors/live-markdown/` - Markdown editor
- **Service Plugins**: 
  - `/plugins/services/logger/` - Logging service with UI
  - `/plugins/services/daily-note/` - Daily note service
