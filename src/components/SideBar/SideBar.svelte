<script lang="ts">
    import FileTreeComp from "./FileTreeComp.svelte";
    import {
        FilePlus,
        FolderPlus,
        Settings,
    } from "@lucide/svelte";
    import Bottom from "./Bottom.svelte";

    let newFileInput: HTMLInputElement | null = $state(null);
    let bottomComponent: Bottom | null = $state(null);
</script>

<div class="bg-gray-800 border-r border-gray-700 h-screen">
    <div class="grid grid-rows-[80px_1fr_auto] h-full">
        <div class="bg-gray-900 border-b border-gray-700 p-4 flex items-center">
            <h2
                class="text-xl font-semibold text-gray-100 uppercase tracking-wide"
            >
                Fichiers
            </h2>
        </div>

        <!-- File/Folder list -->
        <FileTreeComp
            handleDblClick={bottomComponent?.focusInput || (() => {})}
        />

        <Bottom bind:this={bottomComponent} />
    </div>
</div>
