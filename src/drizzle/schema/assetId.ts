import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { AssetType } from '@/types';
import { AssetTable } from '@/drizzle/schema/asset';
import { relations } from 'drizzle-orm';
import { createdAt, updatedAt } from '@/drizzle/schemaHelpers';

export const AssetIdTable = sqliteTable(
	'asset_ids',
	{
		type: text('type').notNull().$type<AssetType>(),
		externalId: text('external_id').notNull(),
		assetId: text('asset_id')
			.notNull()
			.references(() => AssetTable.id, {
				onDelete: 'cascade',
			}),
		createdAt,
		updatedAt,
	},
	(table) => [
		primaryKey({
			name: 'asset_id_pk',
			columns: [table.type, table.externalId],
		}),
	]
);

export const AssetIdAssetRelationships = relations(AssetIdTable, ({ one }) => ({
	asset: one(AssetTable),
}));
