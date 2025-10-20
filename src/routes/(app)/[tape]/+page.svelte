<script lang="ts">
    import SideBar from "$components/SideBar/SideBar.svelte";
    import Editor from "$components/Editor/Editor.svelte";
    import Tabs from "$components/Tabs.svelte";
    import SearchBar from "$components/SearchBar.svelte";
    import { setVaultFilesContext } from "$stores/VaultFiles.svelte";
    import { viewportStore } from "$stores/Viewport.svelte.js";
    import type { FileEntry, FileTree } from "$types/files";
    import Header from "$components/SideBar/Header.svelte";
    import * as Drawer from "$components/ui/drawer";
    import { FilePlus, FolderTree } from "@lucide/svelte";
    import Breadcrumb from "$components/Breadcrumb.svelte";
    import Bottom from "$components/SideBar/Bottom.svelte";
    import * as Resizable from "$components/ui/resizable";

    let { data } = $props();

    let searchBarOpen: boolean = $state(false);

    let vaultEntries = $derived(data.files ?? []);
    let vaultFilesFlat = $derived.by(() => {
        const files: FileEntry[] = [];
        function flatten(tree: FileTree) {
            if (tree.type === "file") {
                files.push(tree);
            } else if (tree.type === "dir" && tree.childs) {
                tree.childs.forEach((child) => flatten(child));
            }
        }
        vaultEntries.forEach((root) => flatten(root));
        return files;
    });
    setVaultFilesContext(() => {
        return {
            vaultEntries,
            vaultFiles: vaultFilesFlat,
        };
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

{#if !viewportStore.isMobile && searchBarOpen}
    <SearchBar bind:searchBarOpen />
{/if}

<div
    class="w-full h-full grid grid-rows-[1fr_auto] md:flex md:flex-row-reverse"
>
    <Resizable.PaneGroup class="hidden md:block" direction="horizontal">
        <Resizable.Pane collapsible={true} collapsedSize={0} class="hidden md:block" minSize={20} maxSize={50} defaultSize={25}>
            <div class="hidden md:flex md:flex-col h-full">
                <SideBar className="h-full bg-gray-800">
                    {#snippet header()}
                        <Header />
                    {/snippet}
                    {#snippet bottom()}
                        <Bottom />
                    {/snippet}
                </SideBar>
            </div>
        </Resizable.Pane>
        <Resizable.Handle class="hidden md:block opacity-0" />
        <Resizable.Pane class="" defaultSize={75} minSize={50}>
            <div class="w-full h-full flex flex-col">
                <Tabs />
                <Breadcrumb />
                <Editor />
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
    <div
        class="md:hidden grow w-full h-12 z-10 grid grid-flow-col items-center"
    >
        <button
            class="w-full h-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
                        bg-gray-800 border-t border-gray-700"
        >
            <FilePlus strokeWidth={1} />
        </button>
        <Drawer.Root bind:open={viewportStore.isMobileSidebarOpen}>
            <Drawer.Trigger
                class="h-full w-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
                        bg-gray-800 border-t border-gray-700"
            >
                <FolderTree strokeWidth={1} />
            </Drawer.Trigger>
            <Drawer.Content class="bg-gray-900 text-gray-200 font-sans p-4">
                <SideBar className="bg-gray-800 rounded" />
            </Drawer.Content>
            <Drawer.Overlay class="fixed inset-0 bg-black/50" />
        </Drawer.Root>
    </div>
</div>
