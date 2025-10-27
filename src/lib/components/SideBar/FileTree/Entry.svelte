<script lang="ts">
	import { clickOutside } from '$lib/attachments/clickOutside';
    import { removeEntryClient, renameEntryClient } from '$lib/clients/files';
	import * as Context from '$lib/components/ui/context-menu';
	import type { FileEntry, FolderEntry } from '$types/files';
	import type { ContextMenuTriggerProps } from 'bits-ui';
	import { tick, type Snippet } from 'svelte';

	type Props = ContextMenuTriggerProps & {
		icon: Snippet;
		entry: FileEntry | FolderEntry;
		className?: string;
	};
	let { icon, className, entry, ...props }: Props = $props();

	let renaming = $state(false);
	let newName = $state(entry.name);

	function handleClickOutside(node: HTMLElement) {
		return clickOutside(node, () => {
			renaming = false;
			newName = '';
		});
	}
</script>

<Context.Root>
	<Context.Trigger
		data-testid={`file-tree-entry-${entry.name}`}
		class="flex gap-2 items-center p-2 md:py-0 text-sm cursor-pointer group relative text-gray-200
		rounded-sm hover:bg-gray-600 hover:border-green-500
		transition-all duration-150 w-full
		{className}"
		{...props}
	>
		{@render icon?.()}
		{#if renaming}
			<input
				data-testid="rename-entry-input"
				{@attach (e) => {
					tick().then(() => {
						e.focus();
						e.select();
					});
				}}
				{@attach handleClickOutside}
				bind:value={newName}
				type="text"
				class="text-gray-200 focus:outline-none w-full"
				onkeydown={async (e) => {
					if (e.key === 'Enter') {
						renaming = false;
						await renameEntryClient(entry.path, newName);
					}
				}}
			/>
		{:else}
			<span>
				{entry.name}
			</span>
		{/if}
	</Context.Trigger>
	<Context.Content>
		<Context.Item
			data-testid="rename-entry-button"
			inset
			onclick={(e) => {
				e.stopPropagation();
				renaming = true;
			}}
		>
			Rename
		</Context.Item>
		<Context.Item
			data-testid="delete-entry-button"
			inset
			onclick={(e) => {
				e.stopPropagation();
				removeEntryClient(entry.path);
			}}
		>
			Delete
		</Context.Item>
	</Context.Content>
</Context.Root>
