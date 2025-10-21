<script lang="ts">
    import { handleDrop } from '$lib/dragdrop';
    import {
    	getFoldStateContext,
    	setFoldStateContext,
    } from '$stores/FoldState.svelte';
    import { getVaultFilesContext } from '$stores/VaultFiles.svelte';
    import { onMount } from 'svelte';
    import FileEntry from './FileEntry.svelte';
    import FolderEntry from './FolderEntry.svelte';

    type Props = {
        handleDblClick?: (_: MouseEvent | KeyboardEvent) => void;
    };

    let { handleDblClick }: Props = $props();

    const vaultFilesStore = getVaultFilesContext();
    let files = $derived(vaultFilesStore().vaultEntries);

    function onDrop(e: DragEvent) {
    	handleDrop(
    		e,
    		{ name: 'root', path: '.', type: 'dir', childs: files },
    		async (_) => {},
    	);
    }

    setFoldStateContext();
    const foldState = getFoldStateContext();
    onMount(() => {
    	foldState.init();
    });
</script>

<div
    class="overflow-hidden rounded flex flex-col group text-sm p-2"
    ondragenter={(_) => {
    	// Todo: style
    	// e.currentTarget.classList.add("bg-gray-600");
    }}
    ondragleave={(_) => {
    	// Todo: style
    	// e.currentTarget.classList.remove("bg-gray-600");
    }}
    ondragover={(e) => {
    	e.preventDefault(); // ! Mandatory to allow drop event
    }}
    ondrop={onDrop}
    role="region"
    ondblclick={(e) => {
    	handleDblClick?.(e);
    }}
>
    <!-- File/Folder list -->
    {#each files as entry (entry.path)}
        {#if entry.type === 'file'}
            <FileEntry {entry} />
        {:else if entry.type === 'dir'}
            <FolderEntry {entry} />
        {/if}
    {/each}
</div>
