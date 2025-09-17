<script lang="ts">
    type Props = {
        OPTIONS: {
            autoSave: boolean;
            lineNumbers: boolean;
            theme: string;
            compactMode: boolean;
        };
        openFiles: { name: string; path: string; content: string }[];
        currentFile: string | null;
        editionAreaList: (HTMLTextAreaElement | undefined)[];
        writeToFile: (fileName: string, content: string) => Promise<void>;
    };

    let {
        OPTIONS,
        openFiles,
        currentFile,
        editionAreaList = $bindable([]),
        writeToFile,
    }: Props = $props();

    let saving = $state(false);
    let saveError = $state(false);

    // Debounce the writeToFile calls
    let timeout: NodeJS.Timeout | null = null;
    async function handleContentChange(name: string, content: string) {
        if (!OPTIONS.autoSave) return;
        saving = true;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                const response = await writeToFile(name, content);
                console.log(`Saved file: ${name}`);
            } catch (error) {
                console.error("Error saving file:", error);
                saveError = true;
            } finally {
                saving = false;
            }
        }, 500);
    }

    // * editionAreaList contains the number of opened/closed files
    // the array doesn't shrink when closing files
    // so we can have undefined entries
    // I don't know if it's serious
    // $inspect(editionAreaList);
</script>

<div class="">
    {#if openFiles.length === 0}
        <div
            class="flex items-center justify-center h-full text-gray-400 font-medium opacity-60"
        >
            Ouvrez un fichier pour commencer à éditer...
        </div>
    {/if}
    {#each openFiles as file, i (file.name)}
        <textarea
            bind:this={editionAreaList[i]}
            bind:value={file.content}
            oninput={() => handleContentChange(file.name, file.content)}
            class:hidden={currentFile !== file.name}
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
