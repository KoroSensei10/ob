<script lang="ts">
	import type { EditorPluginProps } from '$core/types';
	import { serializeAsJSON } from '@excalidraw/excalidraw';
	import Excalidraw from './Excalidraw.svelte';
	import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
	import type { AppState } from '@excalidraw/excalidraw/types/types';

	let { 
		file = $bindable(), 
		handleContentChange
	}: EditorPluginProps = $props();

	let fileProps = $derived(file);

	let initialData = JSON.parse(file.content || '{}');

	let oldData: string = file.content || '';

	function onChange(elements: readonly ExcalidrawElement[], state: AppState) {
		const data = serializeAsJSON(elements, state, {}, 'local');
		if (data === oldData) return;
		file.content = data;
		handleContentChange(new Event('change'), file);
		oldData = data;
	}

</script>


<div class="h-full md:p-2">
	<Excalidraw file={fileProps} theme="dark" initialData={initialData} {onChange} />
</div>
