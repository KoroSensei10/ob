<script lang="ts">
	import type { SideBarComponentProps } from '$core/internal/UIAPI.svelte';

	let {
		plugin,
		coreAPI
	}: SideBarComponentProps = $props();
</script>

<button onclick={() => coreAPI.openPluginView(plugin.id, 'Snoup c\'est la best')}>
	Logger Side Bar
</button>