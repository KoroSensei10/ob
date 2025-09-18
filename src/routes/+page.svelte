<script lang="ts">
    import { tick } from "svelte";
    import SideBar from "../components/SideBar/SideBar.svelte";
    import Editor from "../components/Editor.svelte";
    import Tabs from "../components/Tabs.svelte";

    let { data } = $props();

    const OPTIONS = {
        autoSave: true,
        lineNumbers: true,
        theme: "dark",
        compactMode: false,
        doubleClickToOpen: false,
        // instantOpenFileWhenClicked: true
    };

    let openFiles: { name: string; path: string; content: string }[] = $state(
        [],
    );
    let currentFile: string | null = $state(null);
    let currentFileContent: string | null = $state(null);
    let editionAreaList: HTMLTextAreaElement[] = $state([]);

    function focusEditionArea(name: string) {
        const index = openFiles.findIndex((f) => f.name === name);
        if (editionAreaList[index]) {
            editionAreaList[index].focus();
        }
    }

    async function getFileContent(name: string) {
        if (!name) return;
        if (currentFile === name) return;
        if (currentFileContent !== null) {
            // save current file before switching
            await writeToFile(currentFile, currentFileContent);
        }

        const existingFile = openFiles.find((f) => f.name === name);
        if (existingFile) {
            currentFileContent = existingFile.content;
            currentFile = existingFile.name;
        } else {
            const response = await fetch("/api/getFileContent", {
                method: "POST",
                body: JSON.stringify({
                    fileName: "./data/" + name,
                }),
            });
            if (response.ok) {
                const text = await response.json();
                currentFileContent = text ?? "";
                currentFile = name;
                if (!openFiles.some((f) => f.name === name)) {
                    openFiles.push({
                        name,
                        path: "./data/" + name,
                        content: text,
                    });
                }
            } else {
                throw new Error("Handle error");
            }
        }
        // Focus the textarea after loading content
        await tick();
        focusEditionArea(name);
    }

    async function handleContextMenu(e: MouseEvent) {
        e.preventDefault();
        console.warn("to be implemented");
    }
    async function handleKeys(e: KeyboardEvent) {
        if (e.metaKey && e.key === "k") {
            // open the command palette/file selector
            console.warn("to be implemented");
        } else if (e.metaKey && e.key === "s") {
            // save the current file
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log(`Saved file: ${currentFile}`);
            await writeToFile(currentFile, currentFileContent);
            // TODO: add small feedback
        }
    }
    async function handleCloseTab(e: Event, name: string) {
        e.stopPropagation();

        openFiles = openFiles.filter((f) => f.name !== name);
        if (currentFile === name) {
            currentFile = null;
            currentFileContent = null;
            if (openFiles.length > 0) {
                const lastFile = openFiles[openFiles.length - 1];
                getFileContent(lastFile.name);
            }
        }
    }

    async function writeToFile(name: string | null, content: string | null) {
        if (!name || content === null) return;

        const response = await fetch("/api/writeFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileName: "./data/" + name,
                content,
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
        <SideBar files={data.files} {getFileContent} {handleContextMenu} />

        <!-- Main content -->
        <div class="bg-gray-900 grid grid-rows-[80px_1fr] h-full">
            <Tabs {openFiles} {currentFile} {handleCloseTab} {getFileContent} />

            <Editor
                {OPTIONS}
                {openFiles}
                {currentFile}
                bind:editionAreaList
                {writeToFile}
            />
        </div>
    </div>
</div>
