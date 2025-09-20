<script lang="ts">
    import FileTreeComp from "./FileTreeComp.svelte";
    import { invalidateAll } from "$app/navigation";
    import { getOpenFilesContext } from "$stores/index.svelte";
    import { FilePlus, FolderPlus, Plus, Settings, Folder, Type } from "@lucide/svelte";

    let newFileName: string | null = $state(null);
    let newFileInput: HTMLInputElement | null = $state(null);

    const openFilesContext = getOpenFilesContext();

    async function handleDblClick() {
        if (newFileInput) {
            newFileInput.focus();
        }
    }

    async function handleCreateFile(e: Event) {
        e.preventDefault();
        if (!newFileName) return;

        // TODO: verify client-side first that the filename is valid
        // to give faster feedback to the user

        try {
            const response = await fetch("/api/createFile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: newFileName,
                    content: "", // Fichier vide par défaut
                }),
            });

            if (response.ok) {
                const result = await response.json();
                // Rafraîchir la liste des fichiers ou recharger la page
                await invalidateAll();
                await openFilesContext.getFileContent(result.path);
                newFileName = null; // Clear the input field
            } else {
                const error = await response.json();
                alert(`Erreur lors de la création du fichier: ${error.error}`);
            }
        } catch (error) {
            alert(`Erreur: ${error}`);
        }
    }
</script>

<div class="bg-gray-800 border-r border-gray-700">
    <div class="grid grid-rows-[80px_1fr_auto] h-full">
        <div class="bg-gray-900 border-b border-gray-700 p-4 flex items-center">
            <h2 class="text-xl font-semibold text-gray-100 uppercase tracking-wide">
                Fichiers
            </h2>
        </div>

        <!-- File/Folder list -->
        <svelte:boundary>
            {#snippet pending()}
                <div class="p-4 flex flex-col gap-1">
                    <!-- Skeleton folders -->
                    {#each Array(3) as _, i}
                        <div class="flex items-center gap-2 p-1 px-2 bg-gray-700 border border-gray-600 rounded-lg animate-pulse">
                            <Folder strokeWidth={2} class="w-4 stroke-gray-500 opacity-60" />
                            <div class="h-4 bg-gray-600 rounded flex-1 max-w-32"></div>
                        </div>
                        <!-- Skeleton files indented under folder -->
                        <div class="pl-6 space-y-1">
                            {#each Array(2) as _, j}
                                <div class="flex items-center gap-2 p-1 px-2 bg-gray-700 border border-gray-600 rounded-lg animate-pulse">
                                    <Type strokeWidth={2} class="w-4 stroke-gray-500 opacity-60" />
                                    <div class="h-4 bg-gray-600 rounded flex-1 max-w-24"></div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                    
                    <!-- Skeleton standalone files -->
                    {#each Array(2) as _, i}
                        <div class="flex items-center gap-2 p-1 px-2 bg-gray-700 border border-gray-600 rounded-lg animate-pulse">
                            <Type strokeWidth={2} class="w-4 stroke-gray-500 opacity-60" />
                            <div class="h-4 bg-gray-600 rounded flex-1 max-w-28"></div>
                        </div>
                    {/each}
                </div>
            {/snippet}
            <FileTreeComp {handleDblClick} />
        </svelte:boundary>

        <form onsubmit={handleCreateFile} class="p-4 flex items-center gap-2">
            <input
                bind:this={newFileInput}
                bind:value={newFileName}
                type="text"
                placeholder="Nouveau fichier..."
                class="w-full p-2 bg-gray-700
                    border border-gray-600 rounded-lg focus:outline-none
                    focus:border-purple-400 peer"
            />
            <button
                type="submit"
                class="p-2 cursor-pointer border border-gray-600 b
                        g-transparent peer-focus:bg-purple-500 rounded-lg"
            >
                <Plus strokeWidth={1.6} />
            </button>
        </form>
        <div class="p-4 flex items-center justify-between gap-2
                bg-gray-800 border-t border-gray-700"
        >
            <div class="flex gap-2 items-center">
                <button
                    onclick={() => (newFileInput ? newFileInput.focus() : null)}
                    class="cursor-pointer border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-purple-500 transition-all"
                >
                    <FilePlus strokeWidth={1} class="text-gray-200" />
                </button>
                <button
                    onclick={() => (newFileInput ? newFileInput.focus() : null)}
                    class="cursor-pointer border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                    hover:bg-gray-600 hover:border-purple-500 transition-all"
                >
                    <FolderPlus strokeWidth={1} class="text-gray-200" />
                </button>
            </div>
            <span
                class="border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-purple-500 transition-all cursor-pointer"
            >
                <Settings strokeWidth={1} class="text-gray-200" />
            </span>
        </div>
    </div>
</div>
