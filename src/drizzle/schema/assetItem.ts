import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { AssetTable } from './asset';
import { TransactionTable } from './transaction';
import { UserTable } from './user';
import { AssetClass } from '@/types';

export const AssetItemTable = sqliteTable('asset_items', {
	id,
	name: text('name').notNull(),
	assetClass: text('asset_class').notNull().$type<AssetClass>(),
	userId: text('user_id')
		.notNull()
		.references(() => UserTable.id, {
			onDelete: 'cascade',
		}),
	assetId: text('asset_id')
		.notNull()
		.references(() => AssetTable.id, {
			onDelete: 'restrict',
		}),
	createdAt,
	updatedAt,
});

export const AssetItemUserRelationships = relations(
	AssetItemTable,
	({ one }) => ({
		user: one(UserTable),
	})
);

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
