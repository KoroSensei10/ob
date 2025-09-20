<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import Self from "./FolderEntry.svelte";
    import { Folder, FolderOpen } from "@lucide/svelte";
    import { handleDrop } from "$lib/dragdrop";
    import type { FolderEntry } from "$types/files";

    type Props = {
        entry: FolderEntry;
    };

    let { entry }: Props = $props();

    let isOpen = $state(true);

    function handleClick(e: MouseEvent) {
        isOpen = !isOpen;
        // TODO Use OPTIONS to set the behavior of click/double click
        // TODO see if usefull
        // if (e.detail === 1) {
        //     isOpen = !isOpen;
        // } else if (e.detail === 2) {
        //     // double click
        // } else if (e.detail === 3) {
        //     // triple click
        //     // renaming of file/folder ?
        // }
        // e.stopImmediatePropagation();
    }
</script>

<div
    class="flex flex-col gap-1 h-full"
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
    ondrop={(e) =>
        handleDrop(e, entry, async (_) => {
            isOpen = true;
        })}
    draggable="true"
    ondragstart={(e) => {
        console.log("dragging");
        e.dataTransfer?.setData(
            "json",
            JSON.stringify({ filePath: entry.path }),
        );
        e.stopImmediatePropagation();
    }}
    role="region"
>
    <button
        onclick={handleClick}
        class="flex gap-2 items-center p-1 px-2 cursor-pointer group relative text-gray-200 bg-gray-700
            border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-purple-500
            transition-all duration-150 w-full shadow-sm"
    >
        {#if isOpen}
            <FolderOpen strokeWidth={2} class="w-4 stroke-purple-500" />
        {:else}
            <Folder strokeWidth={2} class="w-4 stroke-purple-400" />
        {/if}
        <span class="block truncate">{entry.name}</span>
    </button>
    {#if entry.childs?.length}
        <div
            class:hidden={!isOpen}
            class="flex duration-200 transition-all flex-col gap-1 border-l border-transparent group-hover:border-gray-600"
        >
            {#each entry.childs ?? [] as child}
                <div class="pl-4">
                    {#if child.type === "file"}
                        <FileEntry
                            entry={child}
                        />
                    {:else if child.type === "dir"}
                        <div class="flex flex-col gap-1">
                            <Self
                                entry={child}
                            />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>
