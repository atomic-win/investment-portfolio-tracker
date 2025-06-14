import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { UserTable } from '@/drizzle/schema/user';
import { createdAt, updatedAt } from '@/drizzle/schemaHelpers';
import { Currency, Language } from '@/types';

export const UserSettingTable = sqliteTable('user_settings', {
	id: text('user_id')
		.notNull()
		.primaryKey()
		.references(() => UserTable.id, {
			onDelete: 'cascade',
		}),
	currency: text('currency').$type<Currency>().default(Currency.USD),
	language: text('language').$type<Language>().default(Language.EN),
	createdAt,
	updatedAt,
});

export const UserSettingUserRelationships = relations(
	UserSettingTable,
	({ one }) => ({
		user: one(UserTable),
	})
);
