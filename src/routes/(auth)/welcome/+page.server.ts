import { redirect, type ServerLoad } from '@sveltejs/kit';
import { getUserCount } from '../../../server/db';

export const load: ServerLoad = async () => {
	// If any users exist, redirect to the login page
	if (await getUserCount() > 0) {
		return redirect(303, '/login');
	}
	return {};
};