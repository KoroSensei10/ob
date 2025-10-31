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
</script>

<div
	class:hidden={file.path !== getActiveFile()?.path}
	class="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-200"
>
	<div class="max-w-2xl text-center space-y-4">
		<h2 class="text-2xl font-bold">Excalidraw Editor</h2>
		<p class="text-gray-400">
			This is a placeholder for an Excalidraw editor plugin.
		</p>
		<p class="text-sm text-gray-500">
			To implement this plugin, you would integrate the Excalidraw library
			and render the canvas here. The file content would be stored as JSON
			representing the Excalidraw scene.
		</p>
		<div class="mt-8 p-4 bg-gray-800 rounded-lg">
			<p class="text-xs text-gray-400 mb-2">File: {file.name}</p>
			<p class="text-xs text-gray-500">Path: {file.path}</p>
		</div>
		
		<!-- Fallback: Show raw content as textarea -->
		<details class="mt-4">
			<summary class="cursor-pointer text-sm text-gray-400 hover:text-gray-200">
				View/Edit Raw Content
			</summary>
			<textarea
				{@attach !viewportStore.isMobile && focus}
				bind:value={file.content}
				oninput={(e) => handleContentChange(e, file)}
				class="w-full h-64 mt-4 p-4 font-mono text-sm leading-relaxed bg-gray-800
						focus:outline-none focus:ring-2 focus:ring-blue-500
						resize-none text-gray-200 placeholder-gray-500 shadow-sm rounded"
				placeholder="Excalidraw JSON content..."
			></textarea>
		</details>
	</div>
</div>
