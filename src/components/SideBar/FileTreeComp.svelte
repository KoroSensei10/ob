<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import FolderEntry from "./FolderEntry.svelte";
    import { handleDrop } from "$lib/dragdrop";
    import { getVaultFiles } from "$lib/files.remote";

    type Props = {
        handleDblClick: () => void;
    };

    let {
        handleDblClick
    }: Props = $props();

    let files = $derived(await getVaultFiles('.'))

    function onDrop(e: DragEvent) {
        handleDrop(e, { name: "root", path: ".", type: "dir", childs: files }, async (_) => {});
    }
</script>

<div class="flex flex-col h-full"
    ondragenter={(e) => {
        // Todo: style
        // e.currentTarget.classList.add("bg-gray-600");
    }}
    ondragleave={(e) => {
        // Todo: style
        // e.currentTarget.classList.remove("bg-gray-600");
    }}
    ondragover={(e) => {
        e.preventDefault(); // ! Mandatory to allow drop event
    }}
    ondrop={onDrop}
    role="region"
>
    <!-- File/Folder list -->
    <div class="flex flex-col gap-1 p-4 bg-gray-800 group text-sm">
        {#each files as entry}
            {#if entry.type === "file"}
                <FileEntry {entry} />
            {:else if entry.type === "dir"}
                <FolderEntry
                    {entry}
                />
            {/if}
        {/each}
        {#if files.length === 0}
            <div
                class="flex items-center h-full text-gray-400 font-medium opacity-60"
            ></div>
        {/if}
    </div>

    <!-- File creation area -->
    <button
        aria-label="create file"
        ondblclick={handleDblClick}
        class="h-full"
    >
    </button>
</div>
