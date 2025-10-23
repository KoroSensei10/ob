<script lang="ts">
    import { dropAndMove } from '$lib/attachments/drop';
    import {
    	getFoldStateContext,
    	setFoldStateContext,
    } from '$stores/FoldState.svelte';
    import { onMount } from 'svelte';
    import FileEntry from './FileEntry.svelte';
    import FolderEntry from './FolderEntry.svelte';
    import { getFileTree, getCurrentTape } from '$lib/files.remote';
    import { getOpenFilesContext } from '$stores/OpenFiles.svelte';

    type Props = {
        handleDblClick?: (_: MouseEvent | KeyboardEvent) => void;
    };

    let { handleDblClick }: Props = $props();

    setFoldStateContext();
    const foldState = getFoldStateContext();
    const openFilesStore = getOpenFilesContext();
	
		let files = $derived(await getFileTree() ?? []);
		
		async function onDrop(e: DragEvent) {
			e.preventDefault();
			e.stopPropagation();
			const tape = await getCurrentTape();
			dropAndMove(
				openFilesStore,
				{ name: tape, path: tape + '/', type: 'dir', childs: files },
				async () => {},
			);
		}
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
    ondrop={(e) => {
    	onDrop(e);
    }}
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
