<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import * as Command from '$lib/components/ui/command';
	import { getFileTree } from '$lib/remotes/files.remote';
	import type { FileEntry, FileTree } from '$types/files';

	interface Props {
		searchBarOpen: boolean;
	}
	let {
		searchBarOpen = $bindable(),
	}: Props = $props();

	let open = $derived(searchBarOpen);
	let files = $derived(flattenFiles((await getFileTree()) ?? []));

	// TODO: move to a utility file
	function flattenFiles(files: FileTree[], parentPath: string = ''): FileEntry[] {
		let flatList: FileEntry[] = [];
		for (const file of files) {
			const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
			if (file.type === 'file') {
				flatList.push({ ...file, path: currentPath });
			} else if (file.type === 'dir' && file.childs) {
				flatList = flatList.concat(flattenFiles(file.childs, currentPath));
			}
		}
		return flatList;
	}
</script>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search a file" />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Files">
			{#each files as entry (entry.path)}
				{#if entry.type === 'file'}
					<Command.Item onSelect={() => {
						open = false;
						coreAPI.openFile(entry);
					}}>
						{entry.name}
					</Command.Item>
				{/if}
			{/each}
		</Command.Group>
		<!-- <Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>Profile</Command.Item>
			<Command.Item>Billing</Command.Item>
			<Command.Item>Settings</Command.Item>
		</Command.Group> -->
	</Command.List>
</Command.Dialog>
