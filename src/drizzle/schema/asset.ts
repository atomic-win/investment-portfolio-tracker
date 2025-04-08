import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const UserTable = sqliteTable('users', {
	id,
	email: text('email').notNull(),
	fullName: text('full_name').notNull(),
	createdAt,
	updatedAt,
});
