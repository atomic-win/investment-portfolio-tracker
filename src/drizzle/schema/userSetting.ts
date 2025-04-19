import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Currency, Language } from '@/types';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';
import { createdAt, updatedAt } from '../schemaHelpers';

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
