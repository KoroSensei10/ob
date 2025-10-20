import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from '$app/environment'

import { auth } from "./server/auth";

export async function handle({ event, resolve }) {
    /// @see https://www.better-auth.com/docs/integrations/svelte-kit
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });
    // Make session and user available on server
    if (session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    }
    return svelteKitHandler({ event, resolve, auth, building });
}