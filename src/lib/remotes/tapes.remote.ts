import { mkdir, readdir, rm } from 'node:fs/promises';
import { DATA_DIR } from '../consts';
import { form, query } from '$app/server';
import z from 'zod';
import path from 'node:path';
import { error } from '@sveltejs/kit';

export const getExistingTapes = query(async () => {
	const entries = await readdir(DATA_DIR, { withFileTypes: true });
	return entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
});

export const createTape = form(
	z.object({
		tapeName: z.string().min(1).max(100)
	}),
	async ({ tapeName }) => {
		console.log(`tapeName: ${tapeName}`);
		const tapePath = path.join(DATA_DIR, tapeName);

		try {
			await mkdir(tapePath);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
				throw error(400, 'Tape already exists');
			} else {
				throw error(500, 'Failed to create tape');
			}
		}

		return { success: true };
	}
);

export const removeTape = form(
	z.object({
		tapeName: z.string().min(1).max(100)
	}),
	async ({ tapeName }) => {
		const tapePath = path.join(DATA_DIR, tapeName);
		try {
			await rm(tapePath, { recursive: true, force: true });
		} catch {
			throw error(500, 'Failed to remove tape');
		}
		return { success: true };
	}
);

