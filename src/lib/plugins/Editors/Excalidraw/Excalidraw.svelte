<script lang="ts">
	import { createElement } from 'react';
	import { createRoot } from 'react-dom/client';
	import type { ExcalidrawProps } from '@excalidraw/excalidraw/types/types';
	import type { FileEntry } from '$types/files';

	let props: ExcalidrawProps & { file: FileEntry} = $props();
	let rootEl: HTMLElement;

	$effect(() => {
		const root = createRoot(rootEl);

		import('@excalidraw/excalidraw').then(({ Excalidraw }) => {
			const excalidraw = createElement(Excalidraw, { ...props });
			root.render(excalidraw);
		});

		return () => root.unmount();
	});
</script>

<div bind:this={rootEl} class="h-full md:shadow-lg md:rounded-xl md:overflow-hidden">

</div>