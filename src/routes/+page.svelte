<script lang="ts">
    import SideBar from "../components/SideBar/SideBar.svelte";
    import Editor from "../components/Editor.svelte";
    import Tabs from "../components/Tabs.svelte";
    import SearchBar from "$components/SearchBar.svelte";
    import { setVaultFilesContext } from "$stores/VaultFiles.svelte";
    import type { FileEntry, FileTree } from "$types/files";

    const OPTIONS = {
        autoSave: true,
        lineNumbers: true,
        theme: "dark",
        compactMode: false,
        doubleClickToOpen: false,
        // instantOpenFileWhenClicked: true
    };

    let {
        data
    } = $props();

    let searchBarOpen: boolean = $state(false);

    let editionAreaList: HTMLTextAreaElement[] = $state([]);

    let vaultEntries = $derived(data.files);
    let vaultFilesFlat = $derived.by(() => {
        const files: FileEntry[] = [];
        function flatten(tree: FileTree) {
            if (tree.type === 'file') {
                files.push(tree);
            } else if (tree.type === 'dir' && tree.childs) {
                tree.childs.forEach(child => flatten(child));
            }
        }
        vaultEntries.forEach(root => flatten(root));
        return files;
    })

    setVaultFilesContext(()=> {
        return {
            vaultEntries,
            vaultFiles: vaultFilesFlat
        }
    });

    async function handleKeys(e: KeyboardEvent) {
        if (e.metaKey && e.key === "k") {
            // open the command palette/file selector
            e.preventDefault();
            e.stopImmediatePropagation();
            searchBarOpen = !searchBarOpen;
        } else if (e.metaKey && e.key === "s") {
            // save the current file
            e.preventDefault();
            e.stopImmediatePropagation();
            // console.log(`Saved file: ${currentFile}`);
            // await writeToFile(currentFile, currentFileContent);
            // TODO: add small feedback
        }
    }
</script>

<svelte:window onkeydown={handleKeys} />

{#if searchBarOpen}
    <SearchBar bind:searchBarOpen />
{/if}

<div class="w-screen h-screen bg-gray-900 text-gray-200 font-sans overscroll-none">
    <div class="grid grid-cols-[350px_1fr] h-full">
        <SideBar />

        <!-- Main content -->
        <div class="bg-gray-900 grid grid-rows-[80px_1fr] h-full">
            <Tabs />
            <Editor bind:editionAreaList {OPTIONS} />
        </div>
    </div>
</div>
