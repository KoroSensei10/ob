<script lang="ts">
    import { createTape } from "$lib/tapes.remote";
    import type { PageServerData } from "./$types";

    type Props = {
        data: PageServerData;
    };
    let { data }: Props = $props();

    let newTapeName: string = $state("");
    let creatingTape: boolean = $state(false);
</script>

<div
    class="h-screen w-screen bg-gray-900 text-gray-200 overflow-auto p-4 px-20
    flex flex-col gap-2"
>
    <h1 class="text-2xl font-bold mb-4">Available Tapes</h1>
    {#each data.tapes as tape}
        <a
            href={`/${tape}`}
            class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
        >
            {tape}
        </a>
    {/each}
    {#if !creatingTape}
        <button
            onclick={() => (creatingTape = true)}
            class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer
            border-dashed border border-gray-600 hover:border-gray-500
            "
        >
            Create New Tape
        </button>
    {:else}
        <form {...createTape.enhance(async (all) => {
            await all.submit();
            creatingTape = false;
            newTapeName = "";
        })} class="flex gap-2">
            <input
                {@attach (node) => node.focus()}
                type="text"
                name="tapeName"
                bind:value={newTapeName}
                placeholder="Enter tape name"
                class="p-2 w-full bg-gray-800 focus:outline-none rounded border border-gray-600"
            />
            <button
                type="submit"
                class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
            >
                Save
            </button>
            <button
                class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                type="button"
                onclick={() => {
                    creatingTape = false;
                    newTapeName = "";
                }}
            >
                Cancel
            </button>
        </form>
    {/if}
</div>
