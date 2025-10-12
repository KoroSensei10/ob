<script lang="ts">
    import { FilePen, Trash, Type } from "@lucide/svelte";
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { FileEntry } from "$types/files";
    import Entry from "./Entry.svelte";
    import { clickOutside } from "$lib/actions/clickOutside";

    type Props = {
        entry: FileEntry;
    };

    let { entry }: Props = $props();

    const openFilesContext = getOpenFilesContext();

    let showContextMenu = $state(false);
    
    let renaming = $state(false);
    let newName = $state(entry.name);

    function handleClickOutside(node: HTMLElement) {
        return clickOutside(node, () => {
            renaming = false;
            newName = entry.name;
            showContextMenu = false;
        });
    }
</script>

<Entry
    draggable="true"
    ondragstart={(e) => {
        e.dataTransfer?.setData(
            "json",
            JSON.stringify({ filePath: entry.path }),
        );
        e.stopPropagation();
    }}
    onclick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await openFilesContext.getFileContent(entry);
    }}
    ondblclick={(e) => {
        e.stopPropagation();
    }}
    oncontextmenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu = !showContextMenu;
    }}
    className="{openFilesContext.activeFile?.path === entry.path
        ? ' bg-green-400/10'
        : ''}
        relative"
>
    <span class="">
        <Type strokeWidth={2} class="w-4 stroke-gray-200" />
    </span>
    {#if renaming}
        <input
            {@attach (e) => {e.focus(); e.select();}}
            {@attach handleClickOutside}
            bind:value={newName}
            type="text"
            class="py-0.5 text-gray-200 focus:outline-none w-full"
            onkeydown={(e) => {
                if (e.key === "Enter") {
                    renaming = false;
                }
            }}
        />
    {:else}
        <span class="block truncate">{entry.name}</span>
    {/if}
    {#if showContextMenu}
        <div
            {@attach handleClickOutside}
            class="absolute left-0 top-full bg-gray-900 border border-gray-600 rounded-md shadow-xl z-50 mt-1 min-w-[160px] py-1"
        >
            <button
                class="w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-200 text-sm flex items-center gap-2 transition-colors"
                onclick={async () => {
                    await openFilesContext.getFileContent(entry);
                    showContextMenu = false;
                }}
            >
                <span class="flex items-center justify-center w-4 h-4">
                    <Type strokeWidth={1} />
                </span>
                Ouvrir
            </button>
            <div class="border-t border-gray-700 my-1"></div>
            <button
                class="w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-200 text-sm flex items-center gap-2 transition-colors"
                onclick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement rename functionality
                    showContextMenu = false;
                    renaming = true;
                }}
            >
                <span class="flex items-center justify-center w-4 h-4">
                    <FilePen strokeWidth={1} />
                </span>
                Renommer
            </button>
            <button
                class="w-full text-left px-3 py-2 hover:bg-red-600 text-red-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                onclick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete functionality
                    showContextMenu = false;
                }}
            >
                <span class="flex items-center justify-center w-4 h-4">
                    <Trash strokeWidth={1} />
                </span>
                Supprimer
            </button>
        </div>
    {/if}
</Entry>
