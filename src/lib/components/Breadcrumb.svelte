<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';

	const {getActiveFile} = coreAPI.files;

	let activeFilePath = $derived(
		getActiveFile()?.path.split('/') ?? [],
	);

	let nbSegment = $derived(activeFilePath?.length);
</script>

{#if activeFilePath.length}
	<div
		data-testid="breadcrumb"
		class={[
			'flex gap-1 px-2 w-fit',
			'text-sm',
			'items-center',
			'text-gray-400',
			'bg-gray-800 rounded-b',
		]}
	>
		{#each activeFilePath || '' as segment, index (index)}
			{#if index !== nbSegment - 1}
				<span class="text-gray-400">{segment}</span>
				<span><ChevronRight class="w-4 h-4" strokeWidth={1} /></span>
			{:else}
				<span class="text-gray-200">{segment}</span>
			{/if}
		{/each}
	</div>
{/if}
