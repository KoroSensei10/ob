<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import EditorRenderer from './Editor/EditorRenderer.svelte';
</script>

{#each coreAPI.tabs as tab (tab.id)}
	<div
		class:hidden={tab.id !== coreAPI.activeTab?.id}
		class="w-full h-full"
	>
		{#if tab.kind === 'file'}
			<EditorRenderer bind:entry={tab.file} />
		{:else if tab.kind === 'plugin'}
			{@const plugin = coreAPI.pluginRegistry.getPlugin(tab.id)}
			{#if plugin}
				{@const ViewComponent = coreAPI.ui.viewItems[plugin?.id]}
				{#if ViewComponent}
					<ViewComponent {coreAPI} {tab} {plugin} />
				{:else}
					<div class="p-4">Plugin component not found</div>
				{/if}
			{:else}
				<div class="p-4">Plugin not found</div>
			{/if}
		{:else}
			<div class="p-4">Unknown Tab Type</div>
		{/if}
	</div>
{/each}
