<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { FilePlus, FolderPlus, FolderUp, Plus, Settings } from "@lucide/svelte";
    import { tick } from "svelte";
    import { type FileTree } from "./+page.server.js";

    let { data } = $props();

    const OPTIONS = {
        autoSave: true,
    };

    let openFiles: Array<{ name: string }> = $state([]);

    let currentFile: string | null = $state(null);
    let currentFileContent: string | null = $state(null);
    let editionArea: HTMLTextAreaElement | null = $state(null);

    async function getFileContent(name: string) {
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
                openFiles.push({ name });
            }

            // Focus the textarea after loading content
            await tick();
            if (editionArea) {
                editionArea.focus();
            }
        } else {
            throw new Error("Handle error");
        }
    }

    async function handleDblClick() {
        // Demander le nom du fichier à l'utilisateur
        const fileName = prompt("Nom du nouveau fichier:");
        if (!fileName) return;

        try {
            const response = await fetch("/api/createFile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: fileName,
                    content: "", // Fichier vide par défaut
                }),
            });

            if (response.ok) {
                const result = await response.json();
                // Rafraîchir la liste des fichiers ou recharger la page
                await invalidateAll();
                await getFileContent(result.fileName);
            } else {
                const error = await response.json();
                alert(`Erreur lors de la création du fichier: ${error.error}`);
            }
        } catch (error) {
            alert(`Erreur: ${error}`);
        }
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

    // Debounce the writeToFile calls
    let timeout: NodeJS.Timeout | null = null;
    async function handleContentChange() {
        if (!OPTIONS.autoSave) return;

        if (timeout) clearTimeout(timeout);
        if (currentFile && currentFileContent !== null) {
            timeout = setTimeout(async () => {
                const response = await writeToFile(
                    currentFile,
                    currentFileContent,
                );
                console.log(`Saved file: ${currentFile}`);
                // TODO: add toast
            }, 500);
        }
    }
</script>

<svelte:window onkeydown={handleKeys} />

{#snippet fileEntry(entry: FileTree)}
    <button
        onclick={() => getFileContent(entry.path)}
        oncontextmenu={handleContextMenu}
        class="cursor-pointer group relative p-2 text-sm font-medium text-gray-200 bg-gray-700
        border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-purple-500
        transition-all duration-150 w-full text-left shadow-sm"
    >
        <span class="block truncate">{entry.name}</span>
    </button>
{/snippet}
{#snippet folderEntry(entry: FileTree)}
    <button
        onclick={() => getFileContent(entry.path)}
        oncontextmenu={handleContextMenu}
        class="flex items-center gap-2 cursor-pointer group relative p-2 text-sm font-medium text-gray-200 bg-gray-700
        border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-purple-500
        transition-all duration-150 w-full text-left shadow-sm"
    >
        <FolderUp strokeWidth={1.5} class="w-6 stroke-purple-500" />
        <span class="block truncate">{entry.name}</span>
    </button>
    {#each entry.childs ?? [] as child}
        <div class="ml-4">
            {#if child.type === "file"}
                {@render fileEntry(child)}
            {:else if child.type === "dir"}
                {@render folderEntry(child)}
            {/if}
        </div>
    {/each}
{/snippet}
{#snippet tabEntry(name: string)}
    <div class="relative group">
        <div
            class="flex bg-gray-800 border border-gray-600 rounded-t-lg
            {currentFile === name
                ? 'bg-gray-700 border-purple-400'
                : 'bg-gray-800 hover:bg-gray-700'} min-w-[160px] h-[50px] shadow-sm"
        >
            <button
                onclick={() => getFileContent(name)}
                class="flex px-4 grow justify-between items-center h-full cursor-pointer font-medium text-gray-200
                transition-colors duration-150 rounded-tl-lg"
            >
                <span class="truncate">{name}</span>
            </button>
            <button
                class="border-l border-gray-600 cursor-pointer text-gray-400 hover:bg-red-600 hover:text-white
                w-[50px] h-full flex justify-center items-center font-medium transition-colors duration-150 rounded-tr-lg"
                onclick={(e) => {
                    e.stopPropagation();

                    openFiles = openFiles.filter((f) => f.name !== name);
                    if (currentFile === name) {
                        currentFile = null;
                        currentFileContent = null;
                    }
                }}
            >
                ×
            </button>
        </div>
    </div>
{/snippet}

<div class="w-screen h-screen bg-gray-900 text-gray-200 font-sans">
    <div class="grid grid-cols-[350px_1fr] h-full">
        <!-- Sidebar -->
        <div class="bg-gray-800 border-r border-gray-700">
            <div class="grid grid-rows-[80px_auto_1fr] h-full">
                <div
                    class="bg-gray-900 border-b border-gray-700 p-4 flex items-center"
                >
                    <h2
                        class="text-xl font-semibold text-gray-100 uppercase tracking-wide"
                    >
                        Fichiers
                    </h2>
                </div>

                <!-- File/Folder list -->
                <div class="p-4 space-y-2 bg-gray-800">
                    {#each data.files as entry}
                        {#if entry.type === "file"}
                            {@render fileEntry(entry)}
                        {:else if entry.type === "dir"}
                            {@render folderEntry(entry)}
                        {/if}
                    {/each}
                    {#if data.files.length === 0}
                        <div class="flex items-center h-full text-gray-400
                            font-medium opacity-60"
                        >
                            Aucun fichier trouvé
                        </div>
                    {/if}
                </div>

                <!-- Create file area -->
                <button
                    aria-label="create file"
                    ondblclick={handleDblClick}
                    oncontextmenu={handleContextMenu}
                    class=""
                >
                </button>

                <!-- File creation area -->
                <div class="p-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Nouveau fichier..."
                        class="w-full p-2 bg-gray-700
                    border border-gray-600 rounded-lg focus:outline-none
                    focus:border-purple-400 peer"
                    />
                    <span class="p-2 border border-gray-600 b
                        g-transparent peer-focus:bg-purple-500 rounded-lg">
                        <Plus strokeWidth={1.6} />
                    </span>
                </div>
                <div
                    class="p-4 flex items-center justify-between gap-2 bg-gray-800 border-t border-gray-700"
                >
                    <div class="flex gap-2 items-center">
                        <span
                            class="border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-purple-500 transition-all cursor-pointer"
                        >
                            <FilePlus strokeWidth={1} class="text-gray-200" />
                        </span>
                        <span
                            class="border border-gray-600 w-10 h-10 flex justify-center items-center rounded-lg
                    hover:bg-gray-600 hover:border-purple-500 transition-all cursor-pointer"
                        >
                            <FolderPlus strokeWidth={1} class="text-gray-200" />
                        </span>
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

        <!-- Main content -->
        <div class="bg-gray-900">
            <div class="grid grid-rows-[80px_1fr] h-full">
                <!-- Tabs -->
                <div
                    class="bg-gray-800 border-b border-gray-700 p-4 overflow-x-auto"
                >
                    <div class="flex gap-2 h-full items-center">
                        {#each openFiles as tab}
                            {@render tabEntry(tab.name)}
                        {/each}
                        {#if openFiles.length === 0}
                            <div
                                class="flex items-center h-full text-gray-400 font-medium opacity-60"
                            >
                                Aucun onglet ouvert
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Editor -->
                {#if currentFileContent !== null}
                    <div class="p-6 bg-gray-900">
                        <textarea
                            bind:this={editionArea}
                            bind:value={currentFileContent}
                            oninput={handleContentChange}
                            class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-800
                            border border-gray-600 rounded-lg focus:outline-none focus:ring-0 focus:ring-purple-500 focus:border-purple-400
                            resize-none text-gray-200 placeholder-gray-500 shadow-sm"
                            placeholder="Commencez à écrire..."
                        ></textarea>
                    </div>
                {:else}
                    <div class="flex justify-center items-center h-full">
                        <div
                            class="text-center p-8 bg-gray-800 border border-gray-600 rounded-xl shadow-sm"
                        >
                            <p
                                class="text-2xl font-medium text-purple-400 mb-2"
                            >
                                Sélectionnez un fichier
                            </p>
                            <p class="text-base text-gray-400">
                                Choisissez dans la barre latérale
                            </p>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>