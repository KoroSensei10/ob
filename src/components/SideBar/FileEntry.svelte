<script lang="ts">
    import { FileType2, Type } from "@lucide/svelte";
    import type { FileTree } from "../../routes/+page.server";

    type Props = {
        entry: FileTree;
        getFileContent: (path: string) => void;
        handleContextMenu: (e: MouseEvent) => void;
    };

    let { entry, getFileContent, handleContextMenu }: Props = $props();
</script>

<button
    draggable="true"
    ondragstart={(e) => {
        console.log("dragging");
        e.dataTransfer?.setData("json", JSON.stringify({ filePath: entry.path }));
        e.stopImmediatePropagation();
    }}
    onclick={() => getFileContent(entry.path)}
    oncontextmenu={handleContextMenu}
    class="flex items-center gap-2 p-1 px-2 cursor-pointer group relative text-gray-200 bg-gray-700
        border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-purple-500
        transition-all duration-150 w-full shadow-sm"
>
    <span class="">
        <Type strokeWidth={2} class="w-4 stroke-gray-200" />
    </span>
    <span class="block truncate">{entry.name}</span>
</button>
