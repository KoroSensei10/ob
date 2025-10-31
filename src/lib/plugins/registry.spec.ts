import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PluginRegistry } from './registry';
import type { EditorPlugin } from './types';
import type { FileEntry } from '$types/files';

// Mock Svelte component
const mockComponent = {} as never;

describe('PluginRegistry', () => {
	let registry: PluginRegistry;

	beforeEach(() => {
		registry = new PluginRegistry();
	});

	describe('register', () => {
		it('should register a plugin', () => {
			const plugin: EditorPlugin = {
				id: 'test-plugin',
				name: 'Test Plugin',
				fileExtensions: ['.test'],
				component: mockComponent
			};

			registry.register(plugin);
			const retrieved = registry.getPlugin('test-plugin');

			expect(retrieved).toBe(plugin);
		});

		it('should warn when registering a plugin with duplicate id', () => {
			const plugin1: EditorPlugin = {
				id: 'test-plugin',
				name: 'Test Plugin 1',
				fileExtensions: ['.test1'],
				component: mockComponent
			};
			const plugin2: EditorPlugin = {
				id: 'test-plugin',
				name: 'Test Plugin 2',
				fileExtensions: ['.test2'],
				component: mockComponent
			};

			const consoleSpy = vi.spyOn(console, 'warn');
			registry.register(plugin1);
			registry.register(plugin2);

			expect(consoleSpy).toHaveBeenCalledWith(
				'Plugin with id \'test-plugin\' is already registered. Overwriting.'
			);
			expect(registry.getPlugin('test-plugin')).toBe(plugin2);
		});
	});

	describe('unregister', () => {
		it('should unregister a plugin', () => {
			const plugin: EditorPlugin = {
				id: 'test-plugin',
				name: 'Test Plugin',
				fileExtensions: ['.test'],
				component: mockComponent
			};

			registry.register(plugin);
			registry.unregister('test-plugin');

			expect(registry.getPlugin('test-plugin')).toBeUndefined();
		});
	});

	describe('getAllPlugins', () => {
		it('should return all registered plugins', () => {
			const plugin1: EditorPlugin = {
				id: 'plugin1',
				name: 'Plugin 1',
				fileExtensions: ['.p1'],
				component: mockComponent
			};
			const plugin2: EditorPlugin = {
				id: 'plugin2',
				name: 'Plugin 2',
				fileExtensions: ['.p2'],
				component: mockComponent
			};

			registry.register(plugin1);
			registry.register(plugin2);

			const plugins = registry.getAllPlugins();
			expect(plugins).toHaveLength(2);
			expect(plugins).toContain(plugin1);
			expect(plugins).toContain(plugin2);
		});
	});

	describe('resolvePlugin', () => {
		it('should resolve plugin by file extension', () => {
			const markdownPlugin: EditorPlugin = {
				id: 'markdown',
				name: 'Markdown',
				fileExtensions: ['.md', '.markdown'],
				component: mockComponent
			};

			registry.register(markdownPlugin);

			const file: FileEntry = {
				name: 'test.md',
				path: '/test.md',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBe(markdownPlugin);
		});

		it('should resolve plugin with wildcard extension', () => {
			const textPlugin: EditorPlugin = {
				id: 'text',
				name: 'Text',
				fileExtensions: ['*'],
				priority: -1,
				component: mockComponent
			};

			registry.register(textPlugin);

			const file: FileEntry = {
				name: 'test.unknown',
				path: '/test.unknown',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBe(textPlugin);
		});

		it('should prioritize plugins by priority', () => {
			const lowPriorityPlugin: EditorPlugin = {
				id: 'low',
				name: 'Low Priority',
				fileExtensions: ['.txt'],
				priority: 1,
				component: mockComponent
			};
			const highPriorityPlugin: EditorPlugin = {
				id: 'high',
				name: 'High Priority',
				fileExtensions: ['.txt'],
				priority: 10,
				component: mockComponent
			};

			registry.register(lowPriorityPlugin);
			registry.register(highPriorityPlugin);

			const file: FileEntry = {
				name: 'test.txt',
				path: '/test.txt',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBe(highPriorityPlugin);
		});

		it('should use custom canHandle function', () => {
			const customPlugin: EditorPlugin = {
				id: 'custom',
				name: 'Custom',
				fileExtensions: [],
				component: mockComponent,
				canHandle: (file) => file.name.includes('special')
			};

			registry.register(customPlugin);

			const file: FileEntry = {
				name: 'special-file.xyz',
				path: '/special-file.xyz',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBe(customPlugin);
		});

		it('should return undefined if no plugin can handle the file', () => {
			const file: FileEntry = {
				name: 'test.unknown',
				path: '/test.unknown',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBeUndefined();
		});

		it('should handle case-insensitive file extensions', () => {
			const markdownPlugin: EditorPlugin = {
				id: 'markdown',
				name: 'Markdown',
				fileExtensions: ['.md'],
				component: mockComponent
			};

			registry.register(markdownPlugin);

			const file: FileEntry = {
				name: 'TEST.MD',
				path: '/TEST.MD',
				type: 'file',
				childs: null,
				content: 'test'
			};

			expect(registry.resolvePlugin(file)).toBe(markdownPlugin);
		});
	});
});
