import { drizzle } from 'drizzle-orm/libsql';

// case for Node.js: scripts (setup-db, setup-test-db)
let dbPath = process.env.DB_PATH!;
// case for Vite: Dev, Build, playwright tests
if (import.meta.env?.MODE) {
	const { DB_PATH } = await import('$env/static/private');
	dbPath = DB_PATH;
}

if (!dbPath) {
	throw new Error('DB_PATH environment variable is not set' + JSON.stringify(process.env));
}

export const db = drizzle(dbPath);

