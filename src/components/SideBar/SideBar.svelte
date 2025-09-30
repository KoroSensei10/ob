<script lang="ts">
    import FileTreeComp from "./FileTreeComp.svelte";
    import FileTreeCompSkeleton from "../Skeletons/FileTreeComp_Sk.svelte";
    import Bottom from "./Bottom.svelte";
    import Header from "./Header.svelte";

    let bottomComponent: Bottom | null = $state(null);
</script>

<div class="bg-gray-800 border-r border-gray-700 h-screen">
    <div class="grid grid-rows-[48px_1fr_auto] h-full">
        <Header />
        {#if bottomComponent}
            <FileTreeComp
                handleDblClick={bottomComponent.focusInput}
            />
        {:else}
            <!-- Skeleton Placeholder -->
            <FileTreeCompSkeleton />
        {/if}
        <Bottom bind:this={bottomComponent} />
    </div>
</div>
