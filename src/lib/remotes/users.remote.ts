import z from 'zod';
import { redirect } from '@sveltejs/kit';
import { form } from '$app/server';
import { auth } from '../../server/auth';
import { getUserCount } from '../../server/db';

export const createInitialUser = form(z.object({
	name: z.string(),
	email: z.string(),
	password: z.string()
}), async ({ name, email, password }) => {

	// 1. Check that we are in initial setup state
	// - If no users exist in the database
	if (await getUserCount() <= 0) {
		// 2. Create the initial user
		// -> This will be then called once to create the first admin user
		await auth.api.createUser({ body: { name, email, password, role: 'admin' } });
	}
	// 3. Redirect to login page
	return redirect(303, '/login');
});