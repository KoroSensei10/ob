<script lang="ts">
    import { Folder, FolderOpen } from "@lucide/svelte";
    import FileEntry from "./FileEntry.svelte";
    import Self from "./FolderEntry.svelte";
    import type { FileTree } from "../../routes/+page.server";

    type Props = {
        entry: FileTree;
        getFileContent: (path: string) => void;
        handleContextMenu: (e: MouseEvent) => void;
    };

    let { entry, getFileContent, handleContextMenu }: Props = $props();

    let isOpen = $state(true);
</script>

<button
    onclick={() => (isOpen = !isOpen)}
    oncontextmenu={handleContextMenu}
    class="flex items-center p-1 px-2 gap-2 cursor-pointer group relative text-gray-200 bg-gray-700
        border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-purple-500
        transition-all duration-150 w-full shadow-sm"
>
    {#if isOpen}
        <FolderOpen strokeWidth={2} class="w-4 stroke-purple-500" />
    {:else}
        <Folder strokeWidth={2} class="w-4 stroke-purple-500" />
    {/if}
    <span class="block truncate">{entry.name}</span>
</button>
<div
    class:hidden={!isOpen}
    class="flex duration-200 transition-all flex-col gap-1 border-l border-transparent group-hover:border-gray-600"
>
    {#each entry.childs ?? [] as child}
        <div class="ml-4">
            {#if child.type === "file"}
                <FileEntry entry={child} {getFileContent} {handleContextMenu} />
            {:else if child.type === "dir"}
                <div class="flex flex-col gap-1">
                    <Self entry={child} {getFileContent} {handleContextMenu} />
                </div>
            {/if}
        </div>
    {/each}
</div>
