<script lang="ts">
	import type { ViewComponentProps } from '$core/internal/UIAPI.svelte';

	let {
		coreAPI
	}: ViewComponentProps = $props();

</script>
<section class="p-2 text-sm text-gray-400">
	Logger !
	{await coreAPI.files.loadFile({path: 'e.md'})}
</section>