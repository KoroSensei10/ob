<script lang="ts">
    import { writeFileContent } from "$lib/files.remote";
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { FileEntry } from "$types/files";
    import type { Options } from "$types/options";

    type Props = {
        OPTIONS: Options;
        editionAreaList: (HTMLTextAreaElement | undefined)[];
    };

    let {
        OPTIONS,
        editionAreaList = $bindable([]),
    }: Props = $props();

    const openFilesContext = getOpenFilesContext();
    
    let saving = $state(false);
    let saveError = $state(false);


    function focusEditionArea(path: string) {
        const index = openFilesContext.openFiles.findIndex(f => f.path === path);
        if (index !== -1 && editionAreaList[index]) {
            editionAreaList[index].focus();
        }
    }

    // Debounce the writeToFile calls
    let timeout: NodeJS.Timeout | null = null;
    async function handleContentChange(
        e: Event,
        file: FileEntry,
    ) {
        if (!OPTIONS.autoSave) return;
        if (file.content === null) return;
        saving = true;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                if (file.content === null) return;
                await writeFileContent({
                    filePath: file.path,
                    content: file.content
                });
            } catch (error) {
                console.error("Error saving file:", error);
                saveError = true;
            } finally {
                saving = false;
            }
        }, 500);
    }

    const openFilesStore = getOpenFilesContext();

    // * editionAreaList contains the number of opened/closed files
    // the array doesn't shrink when closing files
    // so we can have undefined entries
    // I don't know if it's serious
    // $inspect(editionAreaList);

    $effect(() => {
        focusEditionArea(openFilesStore.activeFile?.path ?? "")
    })
</script>

<!-- <svelte:window onfocusEditionArea={() => {
    console.log("focusEditionArea event received");
    
    if (openFilesStore.activeFile) {
        focusEditionArea(openFilesStore.activeFile.path);
    }
}} /> -->

<div class="">
    {#if openFilesStore.openFiles.length <= 0}
        <div
            class="flex items-center justify-center h-full text-gray-400 font-medium opacity-60"
        >
            Ouvrez un fichier pour commencer à éditer...
        </div>
    {/if}
    {#each openFilesStore.openFiles as file, i (file.path)}
        <textarea
            bind:this={editionAreaList[i]}
            bind:value={file.content}
            oninput={(e) => handleContentChange(e, file)}
            class:hidden={file.path !== openFilesStore.activeFile?.path}
            class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
            focus:outline-none focus:ring-0
            resize-none text-gray-200 placeholder-gray-500 shadow-sm"
            placeholder="Commencez à écrire..."
        ></textarea>
    {/each}
    <div
        class="absolute bottom-4 right-4 p-2 opacity-20 flex flex-col items-center justify-center"
    >
        {#if saveError}
            <span class="text-red-500 font-semibold mb-1">Error</span>
        {:else}
            {saving ? "Saving..." : "Saved"}
        {/if}
    </div>
</div>
