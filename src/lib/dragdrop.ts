import { getVaultFiles, moveFile } from "./files.remote";
import type { FolderEntry } from "$types/files";

export async function handleDrop(e: DragEvent, entry: FolderEntry, callback: (response?: Promise<Response>) => Promise<void>) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const data = JSON.parse(e.dataTransfer?.getData("json") ?? "{}");
    console.log(data);

    if (data.filePath) {
        await moveFile({
            entryPath: data.filePath,
            destFolder: entry.path
        }).updates(getVaultFiles('.')); // TODO: optimistic update
        await callback();
    }
}