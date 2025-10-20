import { createFileTree } from "$lib";
import { DATA_DIR } from "$lib/consts";
import { error } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({depends, params}) => {
    depends('files');
    const { tape } = params;
    const tapePath = tape ? `${DATA_DIR}/${tape}` : DATA_DIR;
    let tree;
    try {
        tree = await createFileTree(tapePath);
        return {
            tape: tapePath,
            files: tree
        }
    } catch (e) {
        if (e instanceof Error && e.message.includes('ENOENT')) {
            error(404, 'Tape not found');
        }
    }
}