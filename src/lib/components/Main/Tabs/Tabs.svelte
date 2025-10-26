<script lang="ts">
    import { openFilesStore } from '$stores/OpenFiles.svelte';
import TabEntry from './TabEntry.svelte';
</script>

{#if openFilesStore.openFiles.length}
    <div
        class="bg-gray-900 border-b border-gray-800 h-12 relative overflow-x-auto overscroll-none scrollbar-hide"
    >
        <div class="flex h-full">
            {#each openFilesStore.openFiles as tab (tab.path)}
                <TabEntry entry={tab} />
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
