<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import FolderEntry from "./FolderEntry.svelte";
    import { handleDrop } from "$lib/dragdrop";
    import { getVaultFilesContext } from "$stores/VaultFiles.svelte";

    type Props = {
        handleDblClick: (e: MouseEvent | KeyboardEvent) => void;
    };

    let {
        handleDblClick
    }: Props = $props();

    const vaultFilesStore = getVaultFilesContext();
    let files = $derived(vaultFilesStore().vaultEntries);

    function onDrop(e: DragEvent) {
        handleDrop(e, { name: "root", path: ".", type: "dir", childs: files }, async (_) => {});
    }
</script>

<div class="h-full overflow-auto overscroll-none"
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
    ondblclick={(e) => {
        handleDblClick(e);
    }}
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
</div>
