<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { createFile } from "$lib/files.remote";
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import { FilePlus, FolderPlus, Plus, Settings } from "@lucide/svelte";

    let newFileName: string | null = $state(null);
    let newFileInput: HTMLInputElement | null = $state(null);

    const openFilesContext = getOpenFilesContext();

    async function handleCreateFile(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        if (!newFileName) return;

        // TODO: verify client-side first that the filename is valid
        // to give faster feedback to the user

        // try {
        const result = await createFile(newFileName);
        console.log(result);

        await invalidate("files");
        await openFilesContext.getFileContent(result);
        newFileName = null; // Clear the input field
        // } catch (error) {
        //     alert(`Erreur: ${error}`);
        // }
    }

    export function focusInput() {
        if (newFileInput) {
            newFileInput.focus();
        }
    }
</script>

<div>
    <form onsubmit={handleCreateFile} class="p-4 flex items-center gap-2">
        <input
            bind:this={newFileInput}
            bind:value={newFileName}
            name="fileName"
            type="text"
            placeholder="Nouveau fichier..."
            class="w-full p-2 bg-gray-700
                    border border-gray-600 rounded-lg focus:outline-none
                    focus:border-green-400 peer"
        />
        <button
            type="submit"
            class="p-2 cursor-pointer border border-gray-600 b
                        g-transparent peer-focus:bg-green-500 rounded-lg"
        >
            <Plus strokeWidth={1.6} />
        </button>
    </form>

    <div
        class="p-4 flex items-center justify-between gap-2
                bg-gray-800 border-t border-gray-700"
    >
        <div class="flex gap-2 items-center">
            <button
                onclick={() => focusInput()}
                class="cursor-pointer border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all"
            >
                <FilePlus strokeWidth={1} class="text-gray-200" />
            </button>
            <button
                onclick={() => focusInput()}
                class="cursor-pointer border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                    hover:bg-gray-600 hover:border-green-500 transition-all"
            >
                <FolderPlus strokeWidth={1} class="text-gray-200" />
            </button>
        </div>
        <span
            class="border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all cursor-pointer"
        >
            <Settings strokeWidth={1} class="text-gray-200" />
        </span>
    </div>
</div>
