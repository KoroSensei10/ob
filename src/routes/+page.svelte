<script lang="ts">
    import { createTape } from "$lib/tapes.remote";
    import { authClient } from "$lib/auth-client";
    import type { PageServerData } from "./$types";
    import { logout } from "./(auth)/utils";

    type Props = {
        data: PageServerData;
    };
    let { data }: Props = $props();

    let newTapeName: string = $state("");
    let creatingTape: boolean = $state(false);

    const session = authClient.useSession();
</script>

<div
    class="h-screen w-screen bg-gray-900 text-gray-200 overflow-auto
    flex flex-col gap-2"
>
    <nav class="w-full h-12 flex items-center border-b border-gray-800">
        {$session.data?.user.name ?? "Guest User"}
        {#if $session.data}
            <button
                class="ml-auto mr-4 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                onclick={logout}
            >
                Sign Out
            </button>
        {:else}
            <a
                href="/login"
                class="ml-auto mr-4 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
            >
                Sign In
            </a>
            <a
                href="/signup"
                class="mr-4 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
            >
                Sign Up
            </a>
        {/if}
    </nav>
    <div class="px-20 flex flex-col gap-2 p-4">
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
            <form
                {...createTape.enhance(async (all) => {
                    await all.submit();
                    creatingTape = false;
                    newTapeName = "";
                })}
                class="flex gap-2"
            >
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
</div>
