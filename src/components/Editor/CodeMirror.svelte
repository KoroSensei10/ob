<script lang="ts">
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { FileEntry } from "$types/files";

    type Props = {
        file: FileEntry;
        handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
    };
    let { file, handleContentChange }: Props = $props();

    const openFilesStore = getOpenFilesContext();
</script>

<textarea
    bind:value={file.content}
    oninput={(e) => handleContentChange(e, file)}
    class:hidden={file.path !== openFilesStore.activeFile?.path}
    class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
            focus:outline-none focus:ring-0
            resize-none text-gray-200 placeholder-gray-500 shadow-sm"
    placeholder="Commencez à écrire..."
></textarea>
