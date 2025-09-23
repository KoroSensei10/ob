<script lang="ts">
    import { Type } from "@lucide/svelte";
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { FileEntry } from "$types/files";

    type Props = {
        entry: FileEntry;
    };

    let { entry }: Props = $props();

    const openFilesContext = getOpenFilesContext();
</script>

<button
    draggable="true"
    ondragstart={(e) => {
        e.dataTransfer?.setData("json", JSON.stringify({ filePath: entry.path }));
        e.stopPropagation();
    }}
    onclick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        openFilesContext.getFileContent(entry);
    }}
    ondblclick={(e) => { e.stopPropagation(); }}
    oncontextmenu={() => {}}
    class="flex items-center gap-2 p-1 px-2 cursor-pointer group relative text-gray-200
        border  rounded-lg hover:bg-gray-600 hover:border-purple-500
        transition-all duration-150 w-full shadow-sm
        {openFilesContext.activeFile?.path === entry.path ?
            ' bg-purple-400/10 border-b-purple-500 border-transparent' :
            'bg-gray-700 border-gray-600'}
        "
>
    <span class="">
        <Type strokeWidth={2} class="w-4 stroke-gray-200" />
    </span>
    <span class="block truncate">{entry.name}</span>
</button>