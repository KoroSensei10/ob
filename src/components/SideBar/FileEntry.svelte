<script lang="ts">
    import { Type } from "@lucide/svelte";
    import { getOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { FileEntry } from "$types/files";
    import Entry from "./Entry.svelte";

    type Props = {
        entry: FileEntry;
    };

    let { entry }: Props = $props();

    const openFilesContext = getOpenFilesContext();
</script>

<Entry
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
    className="{openFilesContext.activeFile?.path === entry.path ?
            ' bg-green-400/10' :
            ''}
        "
>
   <span class="">
        <Type strokeWidth={2} class="w-4 stroke-gray-200" />
    </span>
    <span class="block truncate">{entry.name}</span> 
</Entry>