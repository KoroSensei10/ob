import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { admin } from './adminUser.ts';


// Run this script to set up the database and create an admin user

async function setupDb() {
	if (!process.env.DB_FILE_NAME) {
		throw new Error('DB_FILE_NAME environment variable is not set');
	}
	console.info('Using database file:', process.env.DB_FILE_NAME);

	// 1. Run migrations

	// dynamic import avoids creating the db during module load (and thus before we delete the test db file)
	const { db } = await import('../src/server/index.ts');
	migrate(db, { migrationsFolder: './drizzle' });
	console.log('Migrations done');

	// https://www.better-auth.com/docs/plugins/admin#create-user
	// 2. Create test user
	
	// * Using the same auth object as in the main app to ensure consistency
	const { auth } = await import('../src/server/auth.ts');
	try {
		const data = await auth.api.createUser({
			body: admin
		});
		console.log('Successfully created admin user:', data.user);
	} catch (error) {
		if ((error as unknown as { body: { code: string} }).body.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
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