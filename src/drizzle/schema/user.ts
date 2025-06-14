import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers';
import { relations } from 'drizzle-orm';
import { UserSettingTable } from '@/drizzle/schema/userSetting';
import { AssetItemTable } from '@/drizzle/schema/assetItem';

export const UserTable = sqliteTable('users', {
	id,
	email: text('email').notNull(),
	fullName: text('full_name').notNull(),
	createdAt,
	updatedAt,
});

export const UserUserSettingRelationships = relations(UserTable, ({ one }) => ({
	userSetting: one(UserSettingTable),
}));

export const UserAssetItemRelationships = relations(UserTable, ({ many }) => ({
	assetItems: many(AssetItemTable),
}));
