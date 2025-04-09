import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { AssetType, Currency } from '@/types';
import { relations } from 'drizzle-orm';
import { AssetIdTable } from './assetId';
import { AssetItemTable } from './assetItem';

export const AssetTable = sqliteTable('assets', {
	id,
	name: text('name').notNull(),
	type: text('type').notNull().$type<AssetType>(),
	currency: text('currency').notNull().$type<Currency>(),
	createdAt,
	updatedAt,
});

export const AssetAssetIdRelationships = relations(AssetTable, ({ one }) => ({
	assetId: one(AssetIdTable),
}));

export const AssetAssetItemRelationships = relations(
	AssetTable,
	({ many }) => ({
		assetItems: many(AssetItemTable),
	})
);
