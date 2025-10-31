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

<textarea
	{@attach !viewportStore.isMobile && focus}
	bind:value={file.content}
	oninput={(e) => handleContentChange(e, file)}
	class:hidden={file.path !== getActiveFile()?.path}
	class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
			focus:outline-none focus:ring-0
			resize-none text-gray-200 placeholder-gray-500 shadow-sm"
	placeholder="Commencez à écrire..."
></textarea>
