import { afterEach, describe, expect, it, vi } from 'vitest';
import * as usersRemote from './users.remote';

vi.mock('$app/server', async (importOriginal) => {
	const form = (schemaOrHandler: unknown, arg2?: unknown) => {
		// TODO: Fixme: This is a temporary workaround to mock SvelteKit's form function
		// see: https://github.com/sveltejs/kit/issues/14796
		const handler = (arg2 ?? schemaOrHandler) as { __?: { type: string }};
		handler.__ = {
			type: 'form'
		};
		return handler;
	};
	return {
		...(await importOriginal()),
		form
	};
});
vi.mock('@sveltejs/kit', async () => {
	return {
		redirect: vi.fn(),
	};
});

const getUserCountMock = vi.spyOn(await import('../../server/db'), 'getUserCount').mockResolvedValue(0);
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
		// Mock getUserCount to return 0
		getUserCountMock.mockResolvedValueOnce(0);

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
		// Mock getUserCount to return a non-zero value
		getUserCountMock.mockResolvedValue(1);

		// Call createInitialUser
		// @ts-expect-error -- Testing the form handler directly
		await usersRemote.createInitialUser(formData);

		// Expect createUser not to have been called
		expect(createUserMock).not.toHaveBeenCalled();

		// Expect redirect to have been called to /login
		expect((await import('@sveltejs/kit')).redirect).toHaveBeenCalledWith(303, '/login');
	});
});