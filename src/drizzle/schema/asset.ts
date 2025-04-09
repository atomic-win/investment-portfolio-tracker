import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { AssetClass, AssetType, Currency } from '@/types';
import { relations } from 'drizzle-orm';
import { AssetIdTable } from './assetId';
import { AssetItemTable } from './assetItem';
import { DateTime } from 'luxon';
import { AssetRateTable } from './assetRates';

export const AssetTable = sqliteTable('assets', {
	id,
	name: text('name').notNull(),
	class: text('class').notNull().$type<AssetClass>(),
	type: text('type').notNull().$type<AssetType>(),
	currency: text('currency').notNull().$type<Currency>(),
	createdAt,
	updatedAt,
	refreshedAt: text('refreshed_at')
		.notNull()
		.$default(() => DateTime.fromISO('0001-01-01T00:00:00Z').toISO()!),
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

export const AssetAssetRateRelationships = relations(
	AssetRateTable,
	({ many }) => ({
		assetRates: many(AssetRateTable),
	})
);
