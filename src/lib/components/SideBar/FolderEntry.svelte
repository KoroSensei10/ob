<script lang="ts">
    import FileEntry from "./FileEntry.svelte";
    import Self from "./FolderEntry.svelte";
    import { Folder, FolderOpen } from "@lucide/svelte";
    import { handleDrop } from "$lib/dragdrop";
    import Entry from "./Entry.svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import type { FolderEntry } from "$types/files";
    import { getFoldStateContext } from "$stores/FoldState.svelte";

    type Props = {
        entry: FolderEntry;
    };

    let { entry }: Props = $props();

    let foldState = getFoldStateContext();
    let isOpen = $derived(foldState.isFolded(entry.path));

    function handleClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        isOpen = !isOpen;
        foldState.toggleFold(entry.path);
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
    class="flex flex-col"
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
    <Entry onclick={handleClick} ondblclick={(e) => e.stopPropagation()}>
        {#if isOpen}
            <FolderOpen strokeWidth={2} class="w-4 stroke-green-500 " />
        {:else}
            <Folder strokeWidth={2} class="w-4 stroke-transparent fill-green-500" />
        {/if}
        <span class="block truncate">{entry.name}</span> 
    </Entry>
    {#if entry.childs?.length && isOpen}
        <div
            transition:slide={{
                duration: 150
            }}
            class="flex duration-200 transition-all flex-col gap-1 border-l
            md:border-transparent md:group-hover:border-gray-600 border-gray-600"
        >
            {#each entry.childs ?? [] as child (child.path)}
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
