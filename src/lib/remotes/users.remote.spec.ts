import { afterEach, describe, expect, it, vi } from 'vitest';
import * as usersRemote from './users.remote';

vi.mock('$app/server');
vi.mock('@sveltejs/kit');

vi.mock('../../server/db', async () => {
	return {
		db: {},
		getUserCount: vi.fn().mockResolvedValue(1).mockResolvedValueOnce(0)
	};
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserMock = vi.spyOn((await import('../../server/auth')).auth.api, 'createUser').mockResolvedValue({} as any);

describe('users.remote', () => {
	const formData = { 
		name: 'Admin',
		email: 'admin@example.com',
		password: 'password'
	};

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create initial user when no users exist', async () => {
		// Call createInitialUser
		// @ts-expect-error -- Testing the form handler directly
		await usersRemote.createInitialUser(formData);

		// Expect createUser to have been called with correct parameters
		expect(createUserMock).toHaveBeenCalledWith({
			body: { 
				...formData,
				role: 'admin' 
			}
		});

		// Expect redirect to have been called to /login
		expect((await import('@sveltejs/kit')).redirect).toHaveBeenCalledWith(303, '/login');
	});

	it('should redirect when users already exist', async () => {
		// Call createInitialUser
		// @ts-expect-error -- Testing the form handler directly
		await usersRemote.createInitialUser(formData);

		// Expect createUser not to have been called
		expect(createUserMock).not.toHaveBeenCalled();

		// Expect redirect to have been called to /login
		expect((await import('@sveltejs/kit')).redirect).toHaveBeenCalledWith(303, '/login');
	});
});