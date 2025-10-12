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
        newFileName = null;
    }

    export function focusInput() {
        if (newFileInput) {
            newFileInput.focus();
        }
    }
</script>

<div class="text-sm">
    <form onsubmit={handleCreateFile} class="p-2 px-4 flex items-center gap-4">
        <input
            bind:this={newFileInput}
            bind:value={newFileName}
            name="fileName"
            type="text"
            placeholder="Nouveau fichier..."
            class="w-full p-2 py-1 bg-gray-700
                    rounded-lg focus:outline-none
                    peer focus:ring-1 focus:ring-green-500"
        />
        <button
            onclick={() => focusInput()}
            class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
    hover:bg-gray-600 hover:border-green-500 transition-all"
        >
            <Plus strokeWidth={1} />
        </button>
    </form>

    <div
        class="p-2 flex items-center justify-between gap-2
                bg-gray-800 border-t border-gray-700"
    >
        <div class="flex gap-2 items-center">
            <button
                onclick={() => focusInput()}
                class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all"
            >
                <FilePlus strokeWidth={1} class="text-gray-200" />
            </button>
            <button
                onclick={() => focusInput()}
                class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
                    hover:bg-gray-600 hover:border-green-500 transition-all"
            >
                <FolderPlus strokeWidth={1} class="text-gray-200" />
            </button>
        </div>
        <span
            class="w-8 h-8 p-1 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all cursor-pointer"
        >
            <Settings strokeWidth={1} class="text-gray-200" />
        </span>
    </div>
</div>
