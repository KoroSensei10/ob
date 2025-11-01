<script lang="ts">
	import TabEntry from './TabEntry.svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
</script>

{#if coreAPI.files.getOpenFiles().length}
	<div
		class="bg-gray-900 border-b border-gray-800 h-12 relative overflow-x-auto overscroll-none scrollbar-hide"
	>
		<div class="flex h-full">
			{#each coreAPI.files.getOpenFiles() as tab (tab.path)}
				<TabEntry entry={tab} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.scrollbar-hide {
		scrollbar-width: thin;
		scrollbar-color: #4b5563 #1f2937;
	}
</style>
