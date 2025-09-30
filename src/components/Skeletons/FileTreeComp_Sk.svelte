<script lang="ts">
    import EntrySkeleton from "./Entry_Sk.svelte";

    const skeletonData = [
        { 
            type: 'folder', 
            textWidth: 120, 
            delay: 0,
            children: [
                { type: 'file', textWidth: 90, delay: 0 },
                { type: 'file', textWidth: 110, delay: 0 }
            ]
        },
        { type: 'file', textWidth: 100, delay: 75 },
        { type: 'file', textWidth: 130, delay: 150 },
        { 
            type: 'folder', 
            textWidth: 80, 
            delay: 300,
            children: [
                { type: 'file', textWidth: 75, delay: 0 }
            ]
        },
        { type: 'file', textWidth: 95, delay: 500 },
        { type: 'file', textWidth: 115, delay: 700 }
    ];
</script>

<div class="h-full overflow-auto overscroll-none">
    <div class="flex flex-col gap-1 p-4 bg-gray-800 group text-sm">
        {#each skeletonData as item}
            {#if item.type === 'file'}
                <EntrySkeleton textWidth={item.textWidth} delay={item.delay} />
            {:else if item.type === 'folder'}
                <!-- Dossier skeleton -->
                <div>
                    <EntrySkeleton textWidth={item.textWidth} delay={item.delay} />
                    
                    {#if item.children && item.children.length > 0}
                        <!-- Fichiers imbriqués -->
                        <div class="flex flex-col gap-1 border-l border-gray-600 ml-2 pl-4 mt-1">
                            {#each item.children as child}
                                <EntrySkeleton 
                                    textWidth={child.textWidth} 
                                    delay={child.delay}
                                    className="[&_.bg-gray-600]:bg-gray-650" 
                                />
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</div>
