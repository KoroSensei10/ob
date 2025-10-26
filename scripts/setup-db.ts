import { migrate } from 'drizzle-orm/libsql/migrator';
import { admin } from './adminUser.ts';
import { user } from '../src/server/schemas/auth-schema.ts';


// Run this script to set up the database and create an admin user

async function setupDb() {
	if (!process.env.DB_PATH) {
		throw new Error('DB_PATH environment variable is not set');
	}
	console.info('Using database file:', process.env.DB_PATH);

	// 1. Run migrations

	// dynamic import avoids creating the db during module load (and thus before we delete the test db file)
	const { db } = await import('../src/server/db.ts');
	migrate(db, { migrationsFolder: './drizzle' });
	console.log('Migrations done');

	// https://www.better-auth.com/docs/plugins/admin#create-user
	// 2. Create test user
	
	// * Using the same auth object as in the main app to ensure consistency
	const { auth } = await import('../src/server/auth.ts');
	try {
		// Check if any users exists
		const existingsUsers = await db.select().from(user).limit(1).execute();
		if (existingsUsers.length > 0) {
			console.log('Admin user already exists');
			return;
		}
		// Create admin user
		const data = await auth.api.createUser({
			body: admin
		});
		console.log('Successfully created admin user:', data.user);
	} catch (error) {
		if ((error as unknown as { body?: { code?: string} }).body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
			console.log('Admin user already exists');
		} else {
			throw error;
		}
	}
};

setupDb().catch((err) => {
	console.error('Error during initialization:', err);
	process.exit(1);
});