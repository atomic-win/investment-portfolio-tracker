import { index, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { AssetType } from '@/types';
import { AssetTable } from './asset';
import { relations } from 'drizzle-orm';
import { createdAt, updatedAt } from '../schemaHelpers';

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
		index('asset_type_idx').on(table.type),
		index('asset_external_id_idx').on(table.externalId),
	]
);

export const AssetIdAssetRelationships = relations(AssetIdTable, ({ one }) => ({
	asset: one(AssetTable),
}));
