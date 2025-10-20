<script lang="ts">
    import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth-client";

    let email: string = $state("");
    let password: string = $state("");
    let isPasswordValid: boolean = $derived.by(() => {
        return password.length >= 3;
    });

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const { data, error } = await authClient.signIn.email(
            {
                email,
                password,
                rememberMe: true,
            },
            {
                onSuccess: () => {
                    goto("/");
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
        <h2 class="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="email">Email</label>
            <input
                {@attach (node) => node.focus()}
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
        <button
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isPasswordValid}
        >
            Login
        </button>
    </form>
</div>
