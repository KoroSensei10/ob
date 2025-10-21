import { redirect, type ServerLoad } from '@sveltejs/kit';
import { auth } from '../../server/auth';

export const load: ServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session?.user) {
		return {
			user: session.user
		};
	} else {
		redirect(303, '/login');
	}
};