<script lang="ts">
	import { Disc3 } from '@lucide/svelte';
	import Entry from './Entry.svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { dragStore } from '$stores/Drag.svelte';
	import type { FileEntry } from '$types/files';

	const { getActiveFile, openFile } = coreAPI.files;

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
		await openFile(entry);
	}}
	ondblclick={(e) => {
		e.stopPropagation();
	}}
	className={getActiveFile()?.path === entry.path
		? ' bg-green-400 text-gray-700 hover:bg-green-400 hover:text-gray-900'
		: ''}>
	{#snippet icon()}
		<span class="">
			<Disc3 strokeWidth={1.2} class={[
				'w-4',
				getActiveFile()?.path === entry.path
					? 'stroke-gray-700 hover:stroke-gray-900'
					: 'stroke-gray-200',
			]} />
		</span>
	{/snippet}
</Entry>
