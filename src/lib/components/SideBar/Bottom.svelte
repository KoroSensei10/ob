<script lang="ts">
	import { createFile } from '$lib/files.remote';
	import { getOpenFilesContext } from '$stores/OpenFiles.svelte';
	import { FilePlus, FolderPlus, Plus, Settings, X } from '@lucide/svelte';

	let newFileInput: HTMLInputElement | null = $state(null);

	const openFilesCtx = getOpenFilesContext();

	export function focusInput() {
		if (newFileInput) {
			newFileInput.focus();
		}
	}
</script>

<div class="text-sm">
	<form
		{...createFile.enhance(async ({ form, submit }) => {
			try {
				await submit();
				form.reset();
				if (!createFile.result) return;
				openFilesCtx.getFileContent(createFile.result);
			} catch (error) {
				console.error('Error creating file:', error);
			}
		})}
		class="flex flex-col w-full"
	>
		{#if createFile.fields.allIssues()?.length}
			<div class="px-4 p-1 flex justify-between items-center">
				{#each createFile.fields.fileName.issues() as issue (issue.message)}
					<span class="text-xs text-red-500">{issue.message}</span>
				{/each}
				<button type="button" onclick={() => {
					createFile.validate();
					focusInput();
				}}>
					<X
						class="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer"
					/>
				</button>
			</div>
		{/if}
		<div class="pb-2 pl-4 pr-2 flex justify-between items-center gap-4">
			<input
				bind:this={newFileInput}
				{...createFile.fields.fileName.as('text')}
				oninput={() => 
					createFile.validate()
				}
				placeholder="Nouveau fichier..."
				class="w-full p-2 py-1 bg-gray-700
					text-gray-400
					focus:text-gray-200
					border border-gray-600
					hover:ring-green-500 transition-all
					rounded-lg focus:outline-none
					peer focus:ring-1 focus:ring-green-500
					"
			/>
			<button
				{...createFile.buttonProps}
				class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
					hover:bg-gray-600 hover:border-green-500 transition-all"
			>
				<Plus strokeWidth={1} class="text-gray-200" />
			</button>
		</div>
	</form>

	<div
		class="p-2 flex items-center justify-between gap-2
                bg-gray-800 border-t border-gray-700"
	>
		<div class="flex gap-2 items-center">
			<button
				onclick={() => focusInput()}
				class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all"
			>
				<FilePlus strokeWidth={1} class="text-gray-200" />
			</button>
			<button
				onclick={() => focusInput()}
				class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
                    hover:bg-gray-600 hover:border-green-500 transition-all"
			>
				<FolderPlus strokeWidth={1} class="text-gray-200" />
			</button>
		</div>
		<span
			class="w-8 h-8 p-1 flex justify-center items-center rounded-lg
                        hover:bg-gray-600 hover:border-green-500 transition-all cursor-pointer"
		>
			<Settings strokeWidth={1} class="text-gray-200" />
		</span>
	</div>
</div>
