<script lang="ts">
	import { getFileTree } from '$lib/files.remote';
	import { getOpenFilesContext } from '$stores/OpenFiles.svelte';
	import type { FileEntry, FileTree } from '$types/files';

	let {
		searchBarOpen = $bindable(false),
	}: {
		searchBarOpen: boolean;
	} = $props();

	const openFilesStore = getOpenFilesContext();

	let query: string = $state('');

	let results = $derived.by(async () => {
		const q = query.toLowerCase();
		const files: FileEntry[] = [];
		const tree = await getFileTree();
		tree.forEach((t) => flatTree(t, files));
		return files.filter((file) => {
			return (
				file.name.toLowerCase().includes(q) ||
				file.path.toLowerCase().includes(q)
			);
		});
	});

	function flatTree(tree: FileTree, arr: FileEntry[]) {
		if (tree.type === 'file') {
			arr.push(tree);
		} else if (tree.type === 'dir' && tree.childs) {
			tree.childs.forEach((child) => flatTree(child, arr));
		}
	}

	async function handleEntryClick(e: MouseEvent, file: FileEntry) {
		e.preventDefault();
		e.stopImmediatePropagation();
		await openFilesStore.getFileContent(file);
		searchBarOpen = false;
		query = '';
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && searchBarOpen) {
			e.preventDefault();
			e.stopImmediatePropagation();
			searchBarOpen = false;
		}
	}}
/>

<div
	class="fixed w-2/3 max-h-2/3 top-22 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4 z-50
         text-gray-200
        "
	{@attach (element) => {
		document.addEventListener('click', (e) => {
			if (!element.contains(e.target as Node)) {
				searchBarOpen = false;
			}
		});
		return () => {
			document.removeEventListener('click', (e) => {
				if (!element.contains(e.target as Node)) {
					searchBarOpen = false;
				}
			});
		};
	}}
>
	<input
		{@attach (element) => {
			element.focus();
		}}
		type="text"
		placeholder="Search files..."
		class="w-full p-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		bind:value={query}
	/>
	<div class="overflow-y-auto flex flex-col items-start">
		{#each await results as entry (entry.path)}
			<button
				class="mt-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer"
				onclick={(e) => handleEntryClick(e, entry)}
			>
				{entry.name} - {entry.path}
			</button>
		{/each}
	</div>
</div>
