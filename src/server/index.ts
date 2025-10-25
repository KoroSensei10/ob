import { drizzle } from 'drizzle-orm/libsql';

let dbFileName = '';
// case for Vite: Dev, Build, playwright tests
if (import.meta.env?.MODE) {
	const env = await import('$env/static/private');
	dbFileName = env.DB_FILE_NAME;
} else {
	// case for Node.js: scripts (setup-db, setup-test-db)
	dbFileName = process.env.DB_FILE_NAME!;
}

if (!dbFileName) {
	throw new Error('DB_FILE_NAME environment variable is not set');
}

export const db = drizzle(dbFileName);

