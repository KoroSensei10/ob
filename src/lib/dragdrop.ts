import { invalidateAll } from "$app/navigation";
import type { FileTree } from "../routes/+page.server";

async function moveFile(entryPath: string, destFolder: string): Promise<Response> {
    const response = await fetch("/api/moveFile", {
        method: "POST",
        body: JSON.stringify({ entryPath, destFolder }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        await invalidateAll();
        // TODO: update files opened to keep them opened
    } else {
        alert("Error moving file");
    }
    return response
}

export async function handleDrop(e: DragEvent, entry: FileTree & { type: "dir"}, callback: (response?: Promise<Response>) => Promise<void>) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const data = JSON.parse(e.dataTransfer?.getData("json") ?? "{}");
    console.log(data);
    
    if (data.filePath) {
        // TODO: to this server side
        const response = await moveFile(data.filePath, entry.path);
        await callback(Promise.resolve(response));
    }
}