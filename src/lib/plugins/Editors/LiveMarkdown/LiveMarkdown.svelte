<script lang="ts">
	import type { EditorPluginProps } from '$lib/plugins/types';

	let { 
		file = $bindable(), 
		handleContentChange
	}: EditorPluginProps = $props();
</script>

<textarea
	bind:value={file.content}
	oninput={(e) => handleContentChange(e, file)}
	class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
			focus:outline-none focus:ring-0
			resize-none text-gray-200 placeholder-gray-500 shadow-sm
			markdown-editor"
	placeholder="Start writing markdown..."
></textarea>

