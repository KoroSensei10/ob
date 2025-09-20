<script lang="ts">
    import { getOpenFilesContext } from '$stores/index.svelte';
    import type { FileEntry } from '$types/files';

    let {
    } = $props();

    const activeFileStore = getOpenFilesContext();

</script>

{#snippet tabEntry(entry: FileEntry)}
    <div class="relative group">
        <div
            class="flex bg-gray-800 border border-gray-600
            {activeFileStore.activeFile?.path === entry.path
                ? 'bg-gray-700 border-purple-400 rounded-lg overflow-hidden'
                : 'bg-gray-800 hover:bg-gray-700'} h-[50px] shadow-sm"
        >
            <button
                onclick={async () => {
                    await activeFileStore.getFileContent(entry);
                }}
                class="flex px-4 grow justify-between items-center h-full cursor-pointer font-medium text-gray-200
                transition-colors duration-150 rounded-tl-lg"
            >
                <span class="truncate">{entry.name}</span>
            </button>
            <button
                class="border-l border-gray-600 cursor-pointer text-gray-400 hover:bg-red-600 hover:text-white
                w-[50px] h-full flex justify-center items-center font-medium transition-colors duration-150
                opacity-0 group-hover:opacity-100"
                onclick={(e) => {
                    activeFileStore.closeFile(entry);
                }}
            >
                ×
            </button>
        </div>
    </div>
{/snippet}

<div class="bg-gray-800 border-b border-gray-700 p-4 overflow-x-auto">
    <div class="flex h-full items-center">
        {#if activeFileStore.openFiles.length <= 0}
            <div
                class="flex items-center h-full text-gray-400 font-medium opacity-60"
            >
                Aucun onglet ouvert
            </div>
        {/if}
        {#each activeFileStore.openFiles as tab}
            {@render tabEntry(tab)}
        {/each}
    </div>
</div>