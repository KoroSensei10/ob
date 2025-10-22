<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import {
	    OpenFilesStore,
	    setOpenFilesContext,
	} from '$stores/OpenFiles.svelte';
	import { setVaultFilesContext } from '$stores/VaultFiles.svelte';
	import { viewportStore } from '$stores/Viewport.svelte';
	import type { FileEntry, FileTree } from '$types/files';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	const openFilesStore = new OpenFilesStore();
	setOpenFilesContext(openFilesStore);

	let vaultEntries = $derived(data.files ?? []);
	let vaultFilesFlat = $derived.by(() => {
		const files: FileEntry[] = [];
		function flatten(tree: FileTree) {
			if (tree.type === 'file') {
				files.push(tree);
			} else if (tree.type === 'dir' && tree.childs) {
				tree.childs.forEach((child) => flatten(child));
			}
		}
		vaultEntries.forEach((root) => flatten(root));
		return files;
	});
	setVaultFilesContext(() => {
		return {
			tapeEntries: vaultEntries,
			tapeFiles: vaultFilesFlat,
		};
	});

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
