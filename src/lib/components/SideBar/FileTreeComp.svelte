<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import FolderEntry from "./FolderEntry.svelte";
    import { handleDrop } from "$lib/dragdrop";
    import { getVaultFilesContext } from "$stores/VaultFiles.svelte";

    type Props = {
        handleDblClick?: (e: MouseEvent | KeyboardEvent) => void;
    };

    let { handleDblClick }: Props = $props();

    const vaultFilesStore = getVaultFilesContext();
    let files = $derived(vaultFilesStore().vaultEntries);

    function onDrop(e: DragEvent) {
        handleDrop(
            e,
            { name: "root", path: ".", type: "dir", childs: files },
            async (_) => {},
        );
    }
</script>

<div
    class="overflow-hidden rounded flex flex-col group text-sm p-2"
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
        handleDblClick?.(e);
    }}
>
    <!-- File/Folder list -->
    {#each files as entry (entry.path)}
        {#if entry.type === "file"}
            <FileEntry {entry} />
        {:else if entry.type === "dir"}
            <FolderEntry {entry} />
        {/if}
    {/each}
</div>
