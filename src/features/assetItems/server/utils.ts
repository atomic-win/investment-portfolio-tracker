'use server';
import { eq, and, gte } from 'drizzle-orm';
import { desc, lte } from 'drizzle-orm/sql';
import { DateTime } from 'luxon';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';

import { db } from '@/drizzle/db';
import {
	AssetItemTable,
	AssetRateTable,
	AssetTable,
	ExchangeRateTable,
	RateMetadataTable,
} from '@/drizzle/schema';
import { getExchangeRates } from '@/services/exchangeRateApiService';
import { getMutualFundRates } from '@/services/mfApiService';
import { getStockRates } from '@/services/stockApiService';
import { AssetType, Currency } from '@/types';

export async function getAssetItemCurrency(assetItemId: string) {
	'use cache';
	cacheLife('daily');

	const asset = await getAsset(assetItemId);
	return asset.currency;
}

export async function getAssetItemRate(assetItemId: string, date: string) {
	'use cache';
	cacheLife('daily');

	const asset = await getAsset(assetItemId);
	return getAssetRate(asset, date);
}

export async function getExchangeRate(
	from: Currency,
	to: Currency,
	date: string
) {
	'use cache';
	cacheLife('daily');

	if (from === to) {
		return 1;
	}

	await refreshExchangeRates(from, to);

	const rates = await db
		.select({
			rate: ExchangeRateTable.rate,
		})
		.from(ExchangeRateTable)
		.where(
			and(
				eq(ExchangeRateTable.from, from),
				eq(ExchangeRateTable.to, to),
				lte(ExchangeRateTable.date, date),
				gte(
					ExchangeRateTable.date,
					DateTime.fromISO(date).minus({ days: 7 }).toFormat('yyyy-MM-dd')
				)
			)
		)
		.orderBy(desc(ExchangeRateTable.date))
		.limit(1);

	return rates[0].rate;
}

async function getAsset(assetItemId: string) {
	'use cache';
	cacheLife('daily');

	const assetItems = await db
		.select()
		.from(AssetItemTable)
		.where(eq(AssetItemTable.id, assetItemId));

	const assets = await db
		.select()
		.from(AssetTable)
		.where(eq(AssetTable.id, assetItems[0].assetId));

	return assets[0];
}

async function getAssetRate(
	asset: typeof AssetTable.$inferSelect,
	date: string
) {
	'use cache';
	cacheLife('daily');

	const assetType = asset.type;

	if (assetType !== AssetType.MutualFund && assetType !== AssetType.Stock) {
		return 1;
	}

	await refreshAssetRates(asset);

	const rates = await db
		.select({
			date: AssetRateTable.date,
			rate: AssetRateTable.rate,
		})
		.from(AssetRateTable)
		.where(
			and(
				eq(AssetRateTable.id, asset.id),
				lte(AssetRateTable.date, date),
				gte(
					AssetRateTable.date,
					DateTime.fromISO(date).minus({ days: 7 }).toFormat('yyyy-MM-dd')
				)
			)
		)
		.orderBy(desc(AssetRateTable.date))
		.limit(1);

	return rates[0].rate;
}

async function refreshExchangeRates(from: Currency, to: Currency) {
	const lastRefreshedAt = await getExchangeRateLastRefreshedAt(from, to);

	if (DateTime.utc().diff(DateTime.fromISO(lastRefreshedAt)).as('days') <= 1) {
		return;
	}

	const exchangeRates = await getExchangeRates(from, to);

	const ratesToInsert = exchangeRates
		.filter(
			(rate) =>
				rate.date.diff(DateTime.fromISO(lastRefreshedAt)).as('days') >= -1
		)
		.map((rate) => ({
			from,
			to,
			date: rate.date.toFormat('yyyy-MM-dd'),
			rate: rate.rate,
		}));

	if (ratesToInsert.length !== 0) {
		await db
			.insert(ExchangeRateTable)
			.values(ratesToInsert)
			.onConflictDoNothing();
	}

	await db
		.insert(RateMetadataTable)
		.values({
			id: `Currency-${from}-${to}`,
			refreshedAt: DateTime.utc().toISO(),
		})
		.onConflictDoUpdate({
			target: [RateMetadataTable.id],
			set: {
				refreshedAt: DateTime.utc().toISO(),
			},
		});
}

async function refreshAssetRates(asset: typeof AssetTable.$inferSelect) {
	const lastRefreshedAt = await getAssetRateLastRefreshedAt(asset.id);

	if (DateTime.utc().diff(DateTime.fromISO(lastRefreshedAt)).as('days') <= 1) {
		return;
	}

	const assetType = asset.type;

	const assetRates =
		assetType === AssetType.MutualFund
			? await getMutualFundRates(Number(asset.externalId))
			: await getStockRates(asset.externalId!);

	const ratesToInsert = assetRates
		.filter(
			(assetRate) =>
				assetRate.date.diff(DateTime.fromISO(lastRefreshedAt)).as('days') >= -1
		)
		.map((assetRate) => ({
			id: asset.id,
			date: assetRate.date.toFormat('yyyy-MM-dd'),
			rate: assetRate.rate,
		}));

	if (ratesToInsert.length !== 0) {
		await db.insert(AssetRateTable).values(ratesToInsert).onConflictDoNothing();
	}

	await db
		.insert(RateMetadataTable)
		.values({
			id: `Asset-${asset.id}`,
			refreshedAt: DateTime.utc().toFormat('yyyy-MM-dd'),
		})
		.onConflictDoUpdate({
			target: [RateMetadataTable.id],
			set: {
				refreshedAt: DateTime.utc().toISO(),
			},
		});
}

async function getExchangeRateLastRefreshedAt(from: Currency, to: Currency) {
	const rateMetadata = await db
		.select()
		.from(RateMetadataTable)
		.where(and(eq(RateMetadataTable.id, `Currency-${from}-${to}`)));

	if (rateMetadata.length === 0) {
		return '1970-01-01';
	}

	return rateMetadata[0].refreshedAt!;
}

async function getAssetRateLastRefreshedAt(assetId: string) {
	const rateMetadata = await db
		.select()
		.from(RateMetadataTable)
		.where(and(eq(RateMetadataTable.id, `Asset-${assetId}`)));

	if (rateMetadata.length === 0) {
		return '1970-01-01';
	}

	return rateMetadata[0].refreshedAt!;
}
