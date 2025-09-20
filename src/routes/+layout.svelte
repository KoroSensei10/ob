<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/index.svelte';
	
	let { children } = $props();

	const openFilesStore = new ActiveFileStore();
	setOpenFilesContext(openFilesStore);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}