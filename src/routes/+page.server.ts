import { getExistingTapes } from "$lib/tapes.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const tapes = await getExistingTapes();
    return { tapes };
}