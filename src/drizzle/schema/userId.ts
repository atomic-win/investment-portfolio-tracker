import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { createdAt } from '@/drizzle/schemaHelpers';
import { UserTable } from '@/drizzle/schema/user';
import { relations } from 'drizzle-orm';
import { IdentityProvider } from '@/types';

export const UserIdTable = sqliteTable(
	'user_ids',
	{
		id: text('id').notNull(),
		identityProvider: text('identity_provider')
			.notNull()
			.$type<IdentityProvider>(),
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

export const UserIdUserRelationships = relations(UserIdTable, ({ one }) => ({
	user: one(UserTable),
}));
