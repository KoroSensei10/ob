<script lang="ts">
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import { ChevronRight } from "@lucide/svelte";

    const openFilesStore = getOpenFilesContext();

    let openFilePath = $derived(
        openFilesStore.activeFile?.path.split("/") ?? [],
    );
    let nbSegment = $derived(openFilePath?.length);
</script>

{#if openFilePath.length}
    <div class="flex gap-1 px-2 text-sm items-center text-gray-400">
        {#each openFilePath || "" as segment, index (index)}
            {#if index !== nbSegment - 1}
                <span class="text-gray-400">{segment}</span>
                <span><ChevronRight strokeWidth={1} /></span>
            {:else}
                <span class="text-gray-200">{segment}</span>
            {/if}
        {/each}
    </div>
{/if}
