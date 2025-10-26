import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/server/schemas/index.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DB_PATH!,
	},
});
