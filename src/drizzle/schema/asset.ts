import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers';
import { AssetType, Currency } from '@/types';
import { relations } from 'drizzle-orm';
import { AssetIdTable } from '@/drizzle/schema/assetId';
import { AssetItemTable } from '@/drizzle/schema/assetItem';
import { DateTime } from 'luxon';
import { AssetRateTable } from '@/drizzle/schema/assetRates';

export const AssetTable = sqliteTable('assets', {
	id,
	name: text('name').notNull(),
	type: text('type').notNull().$type<AssetType>(),
	currency: text('currency').notNull().$type<Currency>(),
	externalId: text('external_id'),
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
