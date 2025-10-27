<script lang="ts">
    import { createInitialUser } from '$lib/remotes/users.remote';

		let password: string = $state('');
		let passwordConfirm: string = $state('');
		let passwordValid = $derived.by(() => {
			return password && password === passwordConfirm;
		});
</script>


<h1 class="text-3xl text-gray-200">Welcome to Ob!</h1>

<form {...createInitialUser} class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
	<h2 class="text-2xl font-bold text-gray-800 mb-2">Create Initial User</h2>
	<p class="text-gray-600 mb-6">Set up your initial user account.</p>
	
	<div class="space-y-4">
		<label class="block">
			<span class="text-sm font-medium text-gray-700 mb-1 block">Name</span>
			<input {...createInitialUser.fields.name.as('text')} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
		</label>
		
		<label class="block">
			<span class="text-sm font-medium text-gray-700 mb-1 block">Email</span>
			<input {...createInitialUser.fields.email.as('email')} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
		</label>
		
		<label class="block">
			<span class="text-sm font-medium text-gray-700 mb-1 block">Password</span>
			<input bind:value={password} {...createInitialUser.fields.password.as('password')} type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
		</label>

		<label class="block">
			<span class="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</span>
			<input name="passwordConfirm" bind:value={passwordConfirm} type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
		</label>
		
		{#if !passwordValid}
			<p class="text-red-500 text-sm">Passwords do not match.</p>
		{/if}
	</div>

	<button disabled={!passwordValid} {...createInitialUser.buttonProps} name="createInitialUser" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
		Create Initial User
	</button>
</form>