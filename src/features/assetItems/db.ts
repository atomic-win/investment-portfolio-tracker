import { db } from '@/drizzle/db';
import {
	AssetIdTable,
	AssetItemTable,
	AssetRateTable,
	AssetTable,
} from '@/drizzle/schema';
import { AssetType } from '@/types';
import assert from 'assert';
import { and, eq } from 'drizzle-orm';

export async function getAssetId(type: AssetType, externalId: string) {
	const assetIdMapping = await db
		.select()
		.from(AssetIdTable)
		.where(
			and(eq(AssetIdTable.type, type), eq(AssetIdTable.externalId, externalId))
		)
		.get();

	if (!assetIdMapping) {
		return null;
	}

	return assetIdMapping.assetId;
}

export async function getAllAssetItems(userId: string) {
	const result = await db
		.select()
		.from(AssetItemTable)
		.where(eq(AssetItemTable.userId, userId))
		.innerJoin(AssetTable, eq(AssetItemTable.assetId, AssetTable.id))
		.all();

	return result.map(calulateAssetItem);
}

export async function getAssetItem(userId: string, id: string) {
	const result = await db
		.select()
		.from(AssetItemTable)
		.where(and(eq(AssetItemTable.userId, userId), eq(AssetItemTable.id, id)))
		.innerJoin(AssetTable, eq(AssetItemTable.assetId, AssetTable.id))
		.get();

	if (!result) {
		return result;
	}

	return calulateAssetItem(result);
}

export async function getAsset(id: string) {
	return await db.select().from(AssetTable).where(eq(AssetTable.id, id)).get();
}
export async function addAssetId(data: typeof AssetIdTable.$inferInsert) {
	return await db.insert(AssetIdTable).values(data).returning().get();
}

export async function addAsset(data: typeof AssetTable.$inferInsert) {
	return await db.insert(AssetTable).values(data).returning().get();
}

export async function addAssetItem(data: typeof AssetItemTable.$inferInsert) {
	return await db.insert(AssetItemTable).values(data).returning().get();
}

export async function addAssetRates(
	data: (typeof AssetRateTable.$inferInsert)[]
) {
	return await db.insert(AssetRateTable).values(data).returning().get();
}

function calulateAssetItem(data: {
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
		assetId: asset.id,
		assetClass: asset.class,
		assetType: asset.type,
		currency:
			asset.type === AssetType.MutualFunds || asset.type === AssetType.Stocks
				? asset.currency
				: assetItem.currency,
	};
}
