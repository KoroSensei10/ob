import { redirect, type ServerLoad } from '@sveltejs/kit';
import { getUserCount } from '../../../server/db';


export const load: ServerLoad = async () => {
	// If no users exist, redirect to the welcome/setup page
	if (await getUserCount() <= 0) {
		return redirect(303, '/welcome');
	}
	return {};
};