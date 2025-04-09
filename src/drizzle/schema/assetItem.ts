import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { Currency } from '@/types';
import { relations } from 'drizzle-orm';
import { AssetTable } from './asset';
import { TransactionTable } from './transaction';

export const AssetItemTable = sqliteTable('asset_items', {
	id,
	name: text('name').notNull(),
	currency: text('currency').notNull().$type<Currency>(),
	assetId: text('asset_id').references(() => AssetTable.id, {
		onDelete: 'restrict',
	}),
	createdAt,
	updatedAt,
});

export const AssetItemAssetRelationships = relations(
	AssetItemTable,
	({ one }) => ({
		asset: one(AssetTable),
	})
);

export const AssetItemTransactionRelationships = relations(
	AssetItemTable,
	({ many }) => ({
		transactions: many(TransactionTable),
	})
);
