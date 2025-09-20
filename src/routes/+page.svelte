<script lang="ts">
    import SideBar from "../components/SideBar/SideBar.svelte";
    import Editor from "../components/Editor.svelte";
    import Tabs from "../components/Tabs.svelte";
    import type { FileEntry } from "$types/files";


    const OPTIONS = {
        autoSave: true,
        lineNumbers: true,
        theme: "dark",
        compactMode: false,
        doubleClickToOpen: false,
        // instantOpenFileWhenClicked: true
    };

    let editionAreaList: HTMLTextAreaElement[] = $state([]);

    async function handleKeys(e: KeyboardEvent) {
        if (e.metaKey && e.key === "k") {
            // open the command palette/file selector
            console.warn("to be implemented");
        } else if (e.metaKey && e.key === "s") {
            // save the current file
            e.preventDefault();
            e.stopImmediatePropagation();
            // console.log(`Saved file: ${currentFile}`);
            // await writeToFile(currentFile, currentFileContent);
            // TODO: add small feedback
        }
    }
    async function writeToFile(file: FileEntry) {
        if (!file.name || file.content === null) return;

        const response = await fetch("/api/writeFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileName: "./data/" + file.name,
                content: file.content,
            }),
        });

        if (response.ok) {
            // ? add small feedback ?
        } else {
            const error = await response.json();
            alert(`Erreur lors de l'écriture du fichier: ${error.error}`);
        }
    }
</script>

<svelte:window onkeydown={handleKeys} />

<div class="w-screen h-screen bg-gray-900 text-gray-200 font-sans">
    <div class="grid grid-cols-[350px_1fr] h-full">
        <SideBar />

        <!-- Main content -->
        <div class="bg-gray-900 grid grid-rows-[80px_1fr] h-full">
            <Tabs />
            <Editor bind:editionAreaList {OPTIONS} {writeToFile} />
        </div>
    </div>
</div>
