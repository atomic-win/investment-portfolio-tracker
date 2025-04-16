import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { AssetTable } from './asset';

export const AssetRateTable = sqliteTable(
	'asset_rates',
	{
		id: text('id')
			.notNull()
			.references(() => AssetTable.id, {
				onDelete: 'cascade',
			}),
		date: text('date').notNull(),
		rate: real('rate').notNull(),
		createdAt,
		updatedAt,
	},
	(table) => [index('asset_rates_id_date_idx').on(table.id, table.date)]
);

export const AssetRateAssetRelationships = relations(
	AssetRateTable,
	({ one }) => ({
		asset: one(AssetTable),
	})
);
