import assert from 'assert';

import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

import { db } from '@/drizzle/db';
import {
	AssetIdTable,
	AssetItemTable,
	AssetRateTable,
	AssetTable,
} from '@/drizzle/schema';
import {
	assetIdTag,
	assetItemsTag,
	assetItemTag,
} from '@/features/assetItems/server/cacheTag';
import { getFirstTransactionDate } from '@/features/transactions/server/db';
import { AssetType } from '@/types';

export async function getAssetId(type: AssetType, externalId: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(assetIdTag(type, externalId));

	const assetIdMapping = await db
		.select()
		.from(AssetIdTable)
		.where(
			and(
				eq(AssetIdTable.type, type),
				eq(AssetIdTable.externalId, externalId)
			)
		);

	if (!assetIdMapping || assetIdMapping.length === 0) {
		return null;
	}

	return assetIdMapping[0].assetId;
}

export async function getAllAssetItems(userId: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(assetItemsTag(userId));

	const result = await db
		.select()
		.from(AssetItemTable)
		.where(eq(AssetItemTable.userId, userId))
		.innerJoin(AssetTable, eq(AssetItemTable.assetId, AssetTable.id));

	return await Promise.all(result.map(calulateAssetItem));
}

export async function getAssetItem(userId: string, id: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(assetItemTag(userId, id));

	const result = await db
		.select()
		.from(AssetItemTable)
		.where(
			and(eq(AssetItemTable.userId, userId), eq(AssetItemTable.id, id))
		)
		.innerJoin(AssetTable, eq(AssetItemTable.assetId, AssetTable.id));

	if (!result || result.length === 0) {
		return null;
	}

	return await calulateAssetItem(result[0]);
}

export async function addAssetId(data: typeof AssetIdTable.$inferInsert) {
	revalidateTag(assetIdTag(data.type, data.externalId), 'max');
	return await db.insert(AssetIdTable).values(data).returning();
}

export async function addAsset(data: typeof AssetTable.$inferInsert) {
	const assets = await db.insert(AssetTable).values(data).returning();
	return assets[0];
}

export async function addAssetItem(data: typeof AssetItemTable.$inferInsert) {
	return await db.insert(AssetItemTable).values(data).returning();
}

export async function deleteAssetItem(id: string) {
	return await db
		.delete(AssetItemTable)
		.where(eq(AssetItemTable.id, id))
		.returning();
}

export async function addAssetRates(
	data: (typeof AssetRateTable.$inferInsert)[]
) {
	return await db.insert(AssetRateTable).values(data).returning();
}

async function calulateAssetItem(data: {
	asset_items: typeof AssetItemTable.$inferSelect;
	assets: typeof AssetTable.$inferSelect;
}) {
	const { asset_items: assetItem, assets: asset } = data;

	assert(
		assetItem,
		'Asset item should be defined. If you see this error, please report it.'
	);

	assert(
		asset,
		'Asset should be defined. If you see this error, please report it.'
	);

	return {
		id: assetItem.id,
		name: assetItem.name,
		assetClass: assetItem.assetClass,
		assetType: asset.type,
		currency: asset.currency,
		firstTransactionDate: await getFirstTransactionDate(assetItem.id),
	};
}
