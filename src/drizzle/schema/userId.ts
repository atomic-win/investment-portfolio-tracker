import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { createdAt } from '../schemaHelpers';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';

export const UserIdTable = sqliteTable(
	'user_ids',
	{
		id: text('id').notNull(),
		identityProvider: text('identity_provider').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => UserTable.id, {
				onDelete: 'cascade',
			}),
		createdAt,
	},
	(table) => [
		primaryKey({
			name: 'user_id_pk',
			columns: [table.id, table.identityProvider],
		}),
	]
);

export const UserIdRelationships = relations(UserIdTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [UserIdTable.userId],
		references: [UserTable.id],
	}),
}));
