<script lang="ts">
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import { getVaultFilesContext } from "$stores/VaultFiles.svelte";
    import type { FileEntry } from "$types/files";

    let {
        searchBarOpen = $bindable(false),
    }: {
        searchBarOpen: boolean;
    } = $props();

    const openFilesStore = getOpenFilesContext();
    const vaultFilesStore = getVaultFilesContext();
    let results: FileEntry[] = $derived(vaultFilesStore().vaultFiles);

    function handleSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        const query = input.value.toLowerCase();

        results = vaultFilesStore().vaultFiles.filter(
            (file) =>
                file.name.toLowerCase().includes(query) ||
                (file.path && file.path.toLowerCase().includes(query)),
        );
    }

    async function handleEntryClick(e: MouseEvent, file: FileEntry) {
        e.preventDefault();
        e.stopImmediatePropagation();
        await openFilesStore.getFileContent(file);
        searchBarOpen = false;
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && searchBarOpen) {
            e.preventDefault();
            e.stopImmediatePropagation();
            searchBarOpen = false;
        }
    }}
/>

<div class="fixed z-50 w-screen h-screen bg-black/20">
    <div
        class="fixed w-2/3 top-22 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4 z-50
         text-gray-200
        "
        {@attach (element) => {
            document.addEventListener("click", (e) => {
                
                if (!element.contains(e.target as Node)) {
                    searchBarOpen = false;
                }
            });
            return () => {
                document.removeEventListener("click", (e) => {
                    if (!element.contains(e.target as Node)) {
                        searchBarOpen = false;
                    }
                });
            };
        }}
    >
        <input
            {@attach (element) => {
                element.focus();
            }}
            type="text"
            placeholder="Search files..."
            class="w-full p-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            oninput={handleSearch}
        />
        <div class="max-h-1/2 overflow-y-auto flex flex-col items-start">
            {#each results as result}
                <button
                    class="mt-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer"
                    onclick={(e) => handleEntryClick(e, result)}
                >
                    {result.name} - {result.path}
                </button>
            {/each}
        </div>
    </div>
</div>
