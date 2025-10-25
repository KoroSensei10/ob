import { mkdir, rm } from 'node:fs/promises';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { testUser } from '../e2e/data.ts';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

process.loadEnvFile('.env.test');

export async function setupTestDb() {
	if (!process.env.ENV || process.env.ENV !== 'test') {
		throw new Error('This script should only be run in a test environment');
	}
	if (!process.env.DB_FILE_NAME) {
		throw new Error('DB_FILE_NAME environment variable is not set');
	}
	console.info('Using database file:', process.env.DB_FILE_NAME);
	
	// 1. Ensure test data directory exists and is clean

	await rm(path.resolve(import.meta.dirname, '../test-data/'), { recursive: true, force: true });
	await mkdir(path.resolve(import.meta.dirname, '../test-data/'), { recursive: true });
	console.info('Test Dir is clean');

	// 2. Creating database and Run migrations
	const sqlite = new Database(process.env.DB_FILE_NAME!.replace('file:', ''), {
		fileMustExist: false,
	});
	const db = drizzle(sqlite);
	migrate(db, { migrationsFolder: path.resolve(import.meta.dirname, '../drizzle') });
	console.log('Migrations done');

	// https://www.better-auth.com/docs/plugins/admin#create-user
	// 3. Create test user
	// * Using the same auth object as in the main app to ensure consistency
	const { auth } = await import(path.resolve(import.meta.dirname, '../src/server/auth.ts'));
	const data = await auth.api.createUser({
		body: testUser
	});
	console.log('Successfully created test user:', data.user.name);
};


if (import.meta.main) {
	setupTestDb().catch((err) => {
		console.error('Error during initialization:', err);
		process.exit(1);
	});
}