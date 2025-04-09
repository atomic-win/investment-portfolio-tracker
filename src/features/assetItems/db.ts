import { db } from '@/drizzle/db';
import { AssetIdTable, AssetItemTable, AssetTable } from '@/drizzle/schema';
import { AssetType } from '@/types';
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

export async function addAssetId(data: typeof AssetIdTable.$inferInsert) {
	return await db.insert(AssetIdTable).values(data).returning().get();
}

export async function addAsset(data: typeof AssetTable.$inferInsert) {
	return await db.insert(AssetTable).values(data).returning().get();
}

export async function addAssetItem(data: typeof AssetItemTable.$inferInsert) {
	return await db.insert(AssetItemTable).values(data).returning().get();
}
