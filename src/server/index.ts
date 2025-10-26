import { drizzle } from 'drizzle-orm/libsql';
import { DEFAULTS } from './defaults';

// case for Node.js: scripts (setup-db, setup-test-db)
let dbFileName = process.env?.DB_PATH || DEFAULTS.DB_PATH;

// case for Vite: Dev, Build, playwright tests
if (import.meta.env?.MODE) {
	const { env } = await import('$env/dynamic/private');
	if (env.DB_PATH) {
		dbFileName = env.DB_PATH;
	}
}

if (!dbFileName) {
	throw new Error('DB_PATH environment variable is not set' + JSON.stringify(process.env));
}

export const db = drizzle(dbFileName);

