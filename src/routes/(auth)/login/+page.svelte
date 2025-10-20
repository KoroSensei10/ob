<script lang="ts">
    import { login } from "../utils";

    let email = $state("");
    let password = $state("");

    let valid = $derived.by(() => {
        return email.length > 0 && password.length > 0;
    })

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        await login(email, password);
    }
</script>


<div
    class="h-screen w-screen bg-gray-900 text-gray-200 flex items-center justify-center"
>
    <form
        class="flex flex-col gap-4 shadow-2xl rounded-2xl p-8 bg-gray-800 w-96"
        onsubmit={handleSubmit}
    >
        <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
            type="email"
            placeholder="Email"
            bind:value={email}
            class="p-2 border-b border-y-gray-600 focus:outline-none"
            required
        />
        <input
            type="password"
            placeholder="Password"
            bind:value={password}
            class="p-2 border-b border-y-gray-600  focus:outline-none"
            required
        />
        <button
            type="submit"
            class="p-2 rounded cursor-pointer font-bold
                border border-green-400 hover:border-green-300
                hover:bg-gray-900
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:border-green-400
                disabled:bg-gray-900
            "
            disabled={!valid}
        >
            Login
        </button>
    </form>
</div>