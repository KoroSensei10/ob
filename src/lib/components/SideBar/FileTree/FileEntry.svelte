<script lang="ts">
	import { Type } from '@lucide/svelte';
	import Entry from './Entry.svelte';
	import type { FileEntry } from '$types/files';
	import { dragStore } from '$stores/Drag.svelte';
	import { openFilesStore } from '$stores/OpenFiles.svelte';

	type Props = {
		entry: FileEntry;
	};

	let { entry }: Props = $props();
</script>

<Entry
	{entry}
	draggable="true"
	ondragstart={(e) => {
		e.stopPropagation();
		dragStore.drag($state.snapshot(entry));
	}}
	onclick={async (e) => {
		e.preventDefault();
		e.stopPropagation();
		await openFilesStore.openFile(entry);
	}}
	ondblclick={(e) => {
		e.stopPropagation();
	}}
	className={openFilesStore.activeFile?.path === entry.path
		? ' bg-green-400/10'
		: ''}
>
	{#snippet icon()}
		<span class="">
			<Type strokeWidth={2} class="w-4 stroke-gray-200" />
		</span>
	{/snippet}
</Entry>
