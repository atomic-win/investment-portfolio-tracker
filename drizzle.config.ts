import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
	path: '.env.local',
});

if (!process.env.DB_PATH) {
	throw Error(`process.env.DB_PATH is not defined`);
}

export default defineConfig({
	schema: './src/drizzle/schema.ts',
	out: './src/drizzle/migrations',
	dialect: 'sqlite',
	strict: true,
	verbose: true,
	dbCredentials: {
		url: process.env.DB_PATH!,
	},
});
