<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { viewportStore } from '$stores/Viewport.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();


	onMount(() => {
		viewportStore.updateDimensions();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onresize={() => viewportStore.updateDimensions()} />

<div class="w-full h-svh overflow-hidden">
	{@render children?.()}
</div>
