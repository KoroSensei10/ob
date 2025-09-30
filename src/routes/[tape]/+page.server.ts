import { mkdir } from "fs/promises";
import { createFileTree } from "$lib";
import { DATA_DIR } from "$lib/consts";

import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({params, depends}) => {
    const tapeName = params.tape;
    depends('files');
    // console.log(`Fetching files from vault: ${vaultPath}`);
    // Ensure data directory exists
    // TODO: handle custom vault inside data folder
    console.time('generate file tree');
    await mkdir(DATA_DIR, { recursive: true });
    const tree = await createFileTree(DATA_DIR);
    console.timeEnd('generate file tree');
    return {
        files: tree,
        tapeName
    }
}