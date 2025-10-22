<script lang="ts">
    import { getOpenFilesContext } from '$stores/OpenFiles.svelte';
    import type { FileEntry } from '$types/files';
    import TabEntry from './TabEntry.svelte';

    type Props = {
        openFiles: FileEntry[];
    };
    let { openFiles }: Props = $props();

    const activeFileStore = getOpenFilesContext();
</script>

{#if openFiles.length}
    <div
        class="bg-gray-900 border-b border-gray-800 h-12 relative overflow-x-auto overscroll-none scrollbar-hide"
    >
        <div class="flex h-full">
            {#each openFiles as tab (tab.path)}
                <TabEntry entry={tab} {activeFileStore} {openFiles} />
            {/each}
        </div>
    </div>
{/if}

<style>
    .scrollbar-hide {
        scrollbar-width: thin;
        scrollbar-color: #4b5563 #1f2937;
    }
</style>
