<script lang="ts">
    import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth-client";

    let name: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let passwordConfirm: string = $state("");
    let isPasswordValid: boolean = $derived.by(() => {
        return password.length >= 3 && password === passwordConfirm;
    });

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const { data, error } = await authClient.signUp.email(
            {
                email, // user email address
                password, // user password -> min 8 characters by default
                name, // user display name
            },
            {
                onRequest: () => {
                    //show loading
                },
                onSuccess: () => {
                    //redirect to the dashboard or sign in page
                    goto("/");
                },
                onError: (ctx: { error: { message: string } }) => {
                    // display the error message
                    alert(ctx);
                },
            },
        );
    }
</script>

<div class="w-screen h-screen flex items-center justify-center bg-gray-900">
    <form
        class="bg-gray-800 p-8 rounded shadow-md w-96"
        onsubmit={handleSubmit}
    >
        <h2 class="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="name">Name</label>
            <input
                {@attach (node) => node.focus()}
                bind:value={name}
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                type="text"
                id="name"
            />
        </div>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="email">Email</label>
            <input
                bind:value={email}
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                type="email"
                id="email"
            />
        </div>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="password"
                >Password</label
            >
            <input
                bind:value={password}
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                type="password"
                id="password"
            />
        </div>
        <div class="mb-6">
            <label class="block text-gray-300 mb-2" for="passwordConfirm"
                >Confirm Password</label
            >
            <input
                bind:value={passwordConfirm}
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
                type="password"
                id="passwordConfirm"
            />
            {#if passwordConfirm && !isPasswordValid}
                <p class="text-red-400 text-sm mt-2">
                    Passwords do not match or are too short.
                </p>
            {/if}
        </div>
        <button
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isPasswordValid}
        >
            Sign Up
        </button>
        <a href="/login">
            <p class="text-center text-gray-400 text-sm mt-4 hover:underline">
                Already have an account? Log In
            </p>
        </a>
    </form>
</div>
