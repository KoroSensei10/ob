import { redirect } from '@sveltejs/kit'
import { auth } from '../../server/auth'

export async function load({ request }) {
    const session = await auth.api.getSession({
        headers: request.headers
    })
    if (session?.user) {
        return {
            user: session.user
        }
    } else {
        redirect(303, '/login')
    }
}