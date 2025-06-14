import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@/drizzle/schema';

const dbPath = process.env.DB_PATH!;

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
