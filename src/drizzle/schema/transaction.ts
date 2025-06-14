import { relations, sql } from 'drizzle-orm';
import { check, index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AssetItemTable } from '@/drizzle/schema/assetItem';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers';
import { TransactionType } from '@/types';

export const TransactionTable = sqliteTable(
	'transactions',
	{
		id,
		date: text('date').notNull(),
		name: text('name').notNull(),
		assetItemId: text('asset_item_id')
			.notNull()
			.references(() => AssetItemTable.id, {
				onDelete: 'cascade',
			}),
		type: text('type').notNull().$type<TransactionType>(),
		units: real('units').notNull(),
		createdAt,
		updatedAt,
	},
	(table) => [
		index('asset_item_id_idx').on(table.assetItemId),
		check('units_positive_check', sql`${table.units} > 0`),
	]
);

export const TransactionAssetItemRelationships = relations(
	TransactionTable,
	({ one }) => ({
		assetItem: one(AssetItemTable),
	})
);
