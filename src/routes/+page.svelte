<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { onMount, tick } from 'svelte';


    let {
        data,
    } = $props();

    let openFiles: Array<{ name: string }> = $state([
    ]);

    let currentFile: string | null = $state(null);
    let currentFileContent: string | null = $state(null);
    let editionArea: HTMLTextAreaElement | null = $state(null);

    async function getFileContent(name: string) {
        const response = await fetch('/api/getFileContent', {
            method: 'POST',
            body: JSON.stringify({
                fileName: './data/' + name
            })
        })
        if (response.ok) {
            const text = await response.json();
            currentFileContent = text ?? '';

            currentFile = name;
            if (!openFiles.some(f => f.name === name)) {
                openFiles.push({ name });
            }

            // Focus the textarea after loading content
            await tick();
            if (editionArea) {
                editionArea.focus();
            }
        } else {
            throw new Error('Handle error');
        }
    }

    async function handleDblClick() {
        // Demander le nom du fichier à l'utilisateur
        const fileName = prompt('Nom du nouveau fichier:');
        if (!fileName) return;
        
        try {
            const response = await fetch('/api/createFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: fileName,
                    content: ''  // Fichier vide par défaut
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                // Rafraîchir la liste des fichiers ou recharger la page
                await invalidateAll();
                await getFileContent(fileName);
            } else {
                const error = await response.json();
                alert(`Erreur lors de la création du fichier: ${error.error}`);
            }
        } catch (error) {
            alert(`Erreur: ${error}`);
        }
    }

    async function writeToFile(name: string | null, content: string | null) {
        if (!name || content === null) return;

        const response = await fetch('/api/writeFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: './data/' + name,
                content
            })
        });

        if (response.ok) {
            await invalidateAll();
            await getFileContent(name);
        } else {
            const error = await response.json();
            alert(`Erreur lors de l'écriture du fichier: ${error.error}`);
        }
    }
</script>


{#snippet fileEntry(name: string)}
    <button onclick={() => getFileContent(name)} class=" cursor-pointer group relative p-3 text-sm font-bold text-black bg-yellow-300 
        border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
        hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 w-full text-left mb-2">
        <span class="block truncate">{name}</span>
    </button>
{/snippet}
{#snippet tabEntry(name: string)}
    <div class="relative group">
        <div class="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
            {currentFile === name ? 'bg-lime-300' : 'bg-white'} min-w-[160px] h-[50px]">
            <button onclick={() => getFileContent(name)}
                class="flex px-4 grow justify-between items-center h-full cursor-pointer font-bold text-black
                hover:bg-pink-200 transition-colors duration-150">
                <span class="truncate">{name}</span>
            </button>
            <button
                class="border-l-4 border-black cursor-pointer text-black hover:bg-red-500 hover:text-white 
                w-[50px] h-full flex justify-center items-center font-black text-lg transition-colors duration-150"
                onclick={(e) => {
                    e.stopPropagation();

                    openFiles = openFiles.filter(f => f.name !== name);
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

<div class="w-screen h-screen bg-orange-200 text-black font-mono">
    <div class="grid grid-cols-[350px_1fr] h-full">
        <!-- Sidebar -->
        <div class="bg-cyan-300 border-r-8 border-black relative">
            <div class="grid grid-rows-[80px_auto_1fr] h-full relative z-10">
                <div class="bg-yellow-300 border-b-8 border-black p-4 flex items-center relative">
                    <h2 class="text-2xl font-black text-black uppercase tracking-wider">FILES</h2>
                </div>
                
                <!-- File list -->
                <div class="p-4 space-y-2 bg-cyan-300">
                    {#each data.files.filter(f => f.isFile) as entry}
                        {@render fileEntry(entry.name)}
                    {/each}
                </div>
                
                <!-- Create file area -->
                <button ondblclick={handleDblClick}
                    class="flex justify-center items-center h-full text-black cursor-pointer relative group
                    hover:bg-lime-300 transition-colors duration-200 p-8">
                    <div class="text-center">
                        <div class="text-6xl mb-4 font-black">+</div>
                        <p class="font-bold uppercase text-sm tracking-wide">Double Click<br/>Create File</p>
                    </div>
                    <div class="absolute inset-4 border-4 border-dashed border-black opacity-50 
                        group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
            </div>
        </div>

        <!-- Main content -->
        <div class="bg-white relative">
            <div class="grid grid-rows-[80px_1fr] h-full relative z-10">
                <!-- Tabs -->
                <div class="bg-purple-200 border-b-8 border-black p-4 overflow-x-auto">
                    <div class="flex gap-4 h-full items-center">
                        {#each openFiles as tab}
                            {@render tabEntry(tab.name)}
                        {/each}
                        {#if openFiles.length === 0}
                            <div class="flex items-center h-full text-black font-bold text-lg opacity-50">
                                NO TABS OPEN
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Editor -->
                {#if currentFileContent !== null}
                    <div class="relative p-4 bg-white">
                        <textarea
                            bind:this={editionArea}
                            bind:value={currentFileContent}
                            class="w-full h-full p-6 font-mono text-lg leading-relaxed bg-yellow-100 
                            border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            focus:translate-x-1 focus:translate-y-1 transition-all duration-150
                            resize-none text-black placeholder-gray-600"
                            placeholder="Start typing..."
                        ></textarea>
                        <div class="absolute inset-4 bg-red-300 -z-10 translate-x-2 translate-y-2 border-4 border-black"></div>
                        <button onclick={() => writeToFile(currentFile, currentFileContent)}>
                            Save
                        </button>
                    </div>
                {:else}
                    <div class="flex justify-center items-center h-full relative">
                        <div class="text-center p-8 bg-lime-200 border-4 border-black 
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                            <p class="text-3xl font-black text-black uppercase tracking-wider">
                                Select a File
                            </p>
                            <p class="text-lg font-bold text-black mt-2">Choose from the sidebar</p>
                            <div class="absolute inset-0 bg-cyan-300 -z-10 translate-x-2 translate-y-2 border-4 border-black"></div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>