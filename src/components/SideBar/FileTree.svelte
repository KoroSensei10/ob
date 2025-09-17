<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import FolderEntry from "./FolderEntry.svelte";
    import type { FileTree } from "../../routes/+page.server";

    type Props = {
        files: FileTree[];
        getFileContent: (path: string) => void;
        handleContextMenu: (e: MouseEvent) => void;
    }

    let {
        files,
        getFileContent,
        handleContextMenu,
    }: Props = $props();
</script>

<!-- File/Folder list -->
<div class="flex flex-col gap-1 p-4 bg-gray-800 group text-sm">
    {#each files as entry}
        {#if entry.type === "file"}
            <FileEntry {entry} {getFileContent} {handleContextMenu} />
        {:else if entry.type === "dir"}
            <FolderEntry {entry} {getFileContent} {handleContextMenu} />
        {/if}
    {/each}
    {#if files.length === 0}
        <div class="flex items-center h-full text-gray-400 font-medium opacity-60">
        </div>
    {/if}
</div>
