import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry } from './registry';
import { registerDefaultPlugins, pluginRegistry } from './index';
import type { FileEntry } from '$types/files';

describe('Plugin System Integration', () => {
	beforeEach(() => {
		// Clear and re-register plugins for each test
		pluginRegistry.getAllPlugins().forEach(plugin => {
			pluginRegistry.unregister(plugin.id);
		});
		registerDefaultPlugins();
	});

	it('should register default plugins', () => {
		const plugins = pluginRegistry.getAllPlugins();
		
		expect(plugins.length).toBeGreaterThanOrEqual(2);
		expect(plugins.some(p => p.id === 'text-editor')).toBe(true);
		expect(plugins.some(p => p.id === 'markdown-editor')).toBe(true);
	});

	it('should resolve markdown files to markdown editor', () => {
		const file: FileEntry = {
			name: 'notes.md',
			path: '/notes.md',
			type: 'file',
			childs: null,
			content: '# Hello World'
		};

		const plugin = pluginRegistry.resolvePlugin(file);
		expect(plugin).toBeDefined();
		expect(plugin?.id).toBe('markdown-editor');
	});

	it('should resolve unknown files to text editor', () => {
		const file: FileEntry = {
			name: 'unknown.xyz',
			path: '/unknown.xyz',
			type: 'file',
			childs: null,
			content: 'some content'
		};

		const plugin = pluginRegistry.resolvePlugin(file);
		expect(plugin).toBeDefined();
		expect(plugin?.id).toBe('text-editor');
	});

	it('should resolve excalidraw files to excalidraw editor', () => {
		const file: FileEntry = {
			name: 'diagram.excalidraw',
			path: '/diagram.excalidraw',
			type: 'file',
			childs: null,
			content: '{}'
		};

		const plugin = pluginRegistry.resolvePlugin(file);
		expect(plugin).toBeDefined();
		expect(plugin?.id).toBe('excalidraw-editor');
	});

	it('should handle case-insensitive extensions', () => {
		const file: FileEntry = {
			name: 'README.MD',
			path: '/README.MD',
			type: 'file',
			childs: null,
			content: '# README'
		};

		const plugin = pluginRegistry.resolvePlugin(file);
		expect(plugin).toBeDefined();
		expect(plugin?.id).toBe('markdown-editor');
	});

	it('should allow dynamic plugin registration', () => {
		const customRegistry = new PluginRegistry();
		
		// Register a custom plugin
		customRegistry.register({
			id: 'test-plugin',
			name: 'Test Plugin',
			fileExtensions: ['.test'],
			component: {} as never
		});

		const file: FileEntry = {
			name: 'file.test',
			path: '/file.test',
			type: 'file',
			childs: null,
			content: 'test'
		};

		const plugin = customRegistry.resolvePlugin(file);
		expect(plugin).toBeDefined();
		expect(plugin?.id).toBe('test-plugin');
	});
});
