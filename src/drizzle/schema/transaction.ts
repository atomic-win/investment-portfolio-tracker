import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { TransactionType } from '@/types';
import { relations } from 'drizzle-orm';
import { AssetItemTable } from './assetItem';

export const TransactionTable = sqliteTable(
	'transactions',
	{
		id,
		date: text('date').notNull(),
		name: text('name').notNull(),
		type: text('type').notNull().$type<TransactionType>(),
		assetItemId: text('asset_item_id').references(() => AssetItemTable.id, {
			onDelete: 'cascade',
		}),
		createdAt,
		updatedAt,
	},
	(table) => [
		index('transaction_date_idx').on(table.date),
		index('asset_item_id_idx').on(table.assetItemId),
	]
);

export const TransactionAssetItemRelationships = relations(
	TransactionTable,
	({ one }) => ({
		assetItem: one(AssetItemTable),
	})
);
