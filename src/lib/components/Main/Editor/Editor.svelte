<script lang="ts">
	import { writeFileContent } from '$lib/files.remote';
    import { openFilesStore } from '$stores/OpenFiles.svelte';
	import { proxiedSettings } from '$stores/Settings.svelte';
	import type { FileEntry } from '$types/files';
	import CodeMirror from './CodeMirror.svelte';

	let _saving = $state(false);
	let _saveError: string | null = $state(null);

	// Debounce the writeToFile calls
	let timeout: NodeJS.Timeout | null = null;
	async function handleContentChange(e: Event, file: FileEntry) {
		if (!proxiedSettings.autoSave) return;
		if (file.content === null) return;
		_saving = true;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(async () => {
			try {
				if (file.content === null) return;
				await writeFileContent({
					filePath: file.path,
					content: file.content,
				});
			} catch (error) {
				_saveError = String(error);
				console.error('Error saving file:', error);
			} finally {
				_saving = false;
			}
		}, 500);
	}

</script>

<div class="relative w-full h-full">
	{#each openFilesStore.openFiles as file, i (file.path)}
		<CodeMirror bind:file={openFilesStore.openFiles[i]} {handleContentChange} />
	{:else}
		<div
			class="flex h-full items-center justify-center text-gray-400 font-medium opacity-60 p-4"
		>
			Ouvrez un fichier pour commencer à éditer...
		</div>
	{/each}
</div>
