<script lang="ts">
    import { getOpenFilesContext } from '$stores/OpenFiles.svelte';
    import { Type, X } from '@lucide/svelte';
    import type { FileEntry } from '$types/files';

    let {
    } = $props();

    const activeFileStore = getOpenFilesContext();

    function hasNameInCommon(entry: FileEntry): boolean {
        const openFiles = activeFileStore.openFiles;
        if (openFiles.length <= 1) return false;

        const nameCount = openFiles.reduce((count, file) => {
            return file.name === entry.name ? count + 1 : count;
        }, 0);

        return nameCount > 1;
    }

</script>

{#snippet tabEntry(entry: FileEntry)}
    <div class="relative group">
        <div
            class="flex relative bg-gray-800 border-b-2 transition-all duration-200
            {activeFileStore.activeFile?.path === entry.path
                ? 'bg-gray-700 border-purple-400 shadow-lg shadow-purple-400/10'
                : 'bg-gray-800 hover:bg-gray-750 border-transparent hover:border-gray-600'} 
            h-[80px] min-w-[180px] max-w-[240px]"
        >
            <button
                onclick={async () => {
                    await activeFileStore.getFileContent(entry);
                }}
                class="flex px-4 py-3 grow justify-center items-center h-full cursor-pointer font-medium 
                text-gray-200 transition-all duration-200 group/tab
                {activeFileStore.activeFile?.path === entry.path 
                    ? 'text-purple-100' 
                    : 'hover:text-white'}"
            >
                <div class="flex items-center text-sm gap-1 min-w-0">
                    <!-- File name -->
                    {#if hasNameInCommon(entry)}
                        {@const parentDir = entry.path.split('/').at(-2)}
                        <span class="text-xs text-gray-400 italic">
                            {parentDir ? `.../${parentDir}/` : './'}
                        </span>
                    {/if}
                    <span class="truncate max-w-[120px]">{entry.name}</span>
                </div>
            </button>
            <!-- Close button -->
            <button
                class="absolute cursor-pointer top-2 right-2 w-6 h-6 flex justify-center items-center
                text-gray-500 hover:text-white rounded-full
                transition-all duration-200 opacity-0 group-hover:opacity-100
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

<div class="bg-gray-800 border-b border-gray-700 h-[80px] overflow-hidden">
    <div class="flex h-full items-stretch overflow-x-auto scrollbar-hide">
        {#if activeFileStore.openFiles.length <= 0}
            <div class="flex items-center justify-center h-full text-gray-400 font-medium opacity-60 px-6">
                    <span>Aucun onglet ouvert</span>
            </div>
        {:else}
            {#each activeFileStore.openFiles as tab}
                {@render tabEntry(tab)}
            {/each}
        {/if}
    </div>
</div>

<style>
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>