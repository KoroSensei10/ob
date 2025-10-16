<script lang="ts">
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import { X } from "@lucide/svelte";
    import type { FileEntry } from "$types/files";

    let {} = $props();

    const activeFileStore = getOpenFilesContext();
    let openFiles = $derived(activeFileStore.openFiles);

    function hasNameInCommon(entry: FileEntry): boolean {
        const openFiles = activeFileStore.openFiles;
        if (openFiles.length <= 1) return false;

        const nameCount = openFiles.reduce((count, file) => {
            return file.name === entry.name ? count + 1 : count;
        }, 0);

        return nameCount > 1;
    }

    function scrollToView(entry: FileEntry) {
        return (node: HTMLDivElement) => {
            if (entry.path === activeFileStore.activeFile?.path) {
                node.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                    inline: "center",
                });
            }
        };
    }
</script>

<div
    class="bg-gray-900 border-b border-gray-800 h-12 relative overflow-x-auto overscroll-none scrollbar-hide"
>
    <div class="flex h-full">
        {#each openFiles as tab}
            {@render tabEntry(tab)}
        {:else}
            <div
                class="flex items-center justify-center text-gray-400 font-medium opacity-60 px-6"
            >
                <span>Aucun onglet ouvert</span>
            </div>
        {/each}
    </div>
</div>

{#snippet tabEntry(entry: FileEntry)}
    <div class="relative group h-full" {@attach scrollToView(entry)}>
        <div
            class="flex h-full justify-center items-center relative border-b
            {activeFileStore.activeFile?.path === entry.path
                ? ' border-green-400'
                : ' hover:bg-gray-750 border-transparent hover:border-gray-600'} 
            min-w-[120px] max-w-[180px]
            md:min-w-[180px] md:max-w-[240px]
            "
        >
            <button
                onclick={async () => {
                    await activeFileStore.getFileContent(entry);
                }}
                class="flex h-full w-full justify-center items-center cursor-pointer font-medium
                text-gray-200 transition-all duration-200 mx-4 truncate text-ellipsis
                {activeFileStore.activeFile?.path === entry.path
                    ? 'text-green-100'
                    : 'hover:text-white'}"
            >
                <div class="flex items-center text-sm gap-1 min-w-0">
                    <!-- File name -->
                    {#if hasNameInCommon(entry)}
                        {@const parentDir = entry.path.split("/").at(-2)}
                        <span class="text-xs text-gray-400 italic">
                            {parentDir ? `.../${parentDir}/` : "./"}
                        </span>
                    {/if}
                    <span class="">{entry.name}</span>
                </div>
            </button>
            <!-- Close button -->
            <button
                class="absolute cursor-pointer top-2 right-2 w-6 h-6 flex justify-center items-center
                text-gray-500 hover:text-white rounded-full
                transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100
                text-xs font-bold"
                onclick={(e) => {
                    e.stopPropagation();
                    activeFileStore.closeFile(entry);
                }}
            >
                <X />
            </button>
        </div>
    </div>
{/snippet}

<style>
    .scrollbar-hide {
        scrollbar-width: thin;
        scrollbar-color: #4b5563 #1f2937;
    }
</style>
