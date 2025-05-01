'use server';
import { db } from '@/drizzle/db';
import {
	AssetItemTable,
	AssetRateTable,
	AssetTable,
	ExchangeRateTable,
} from '@/drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';
import { desc, lte, max } from 'drizzle-orm/sql';
import { AssetType, Currency } from '@/types';
import { DateTime } from 'luxon';
import { getMutualFundNav } from '@/services/mfApiService';
import { getStockPrices } from '@/services/stockApiService';
import { getExchangeRates } from '@/services/exchangeRateApiService';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import {
	assetRateLastUpdatedAtTag,
	exchangeRateLastUpdatedAtTag,
} from './cacheTag';
import { revalidateTag } from 'next/cache';

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
	const lastUpdatedAt = await getExchangeRateLastUpdatedAt(from, to);

	if (DateTime.utc().diff(DateTime.fromISO(lastUpdatedAt)).as('days') <= 1) {
		return;
	}

	const exchangeRates = await getExchangeRates(from, to);

	const toInsert = exchangeRates.filter(
		(rate) =>
			DateTime.fromISO(rate.date)
				.diff(DateTime.fromISO(lastUpdatedAt))
				.as('days') >= -1
	);

	const rates = toInsert.map((rate) => ({
		from,
		to,
		...rate,
	}));

	if (rates.length === 0) {
		return Promise.resolve();
	}

	await db.insert(ExchangeRateTable).values(rates).onConflictDoNothing();

	revalidateTag(exchangeRateLastUpdatedAtTag(from, to));
	return Promise.resolve();
}

async function refreshAssetRates(asset: typeof AssetTable.$inferSelect) {
	const lastUpdatedAt = await getAssetRateLastUpdatedAt(asset.id);

	if (DateTime.utc().diff(DateTime.fromISO(lastUpdatedAt)).as('days') <= 1) {
		return Promise.resolve();
	}

	const assetType = asset.type;

	if (assetType === AssetType.MutualFund) {
		return await refreshMutualFundRates(asset, lastUpdatedAt);
	}

	return await refreshStockRates(asset, lastUpdatedAt);
}

async function refreshMutualFundRates(
	asset: typeof AssetTable.$inferSelect,
	lastUpdatedAt: string
) {
	const mfApiResponse = await getMutualFundNav(Number(asset.externalId));

	const rates = mfApiResponse!
		.data!.filter(
			(rate) =>
				DateTime.fromFormat(rate.date, 'dd-MM-yyyy')
					.diff(DateTime.fromISO(lastUpdatedAt))
					.as('days') >= -1
		)
		.map((rate) => ({
			id: asset.id,
			date: DateTime.fromFormat(rate.date, 'dd-MM-yyyy').toFormat('yyyy-MM-dd'),
			rate: Number(rate.nav),
		}));

	if (rates.length === 0) {
		return Promise.resolve();
	}

	await db.insert(AssetRateTable).values(rates).onConflictDoNothing();

	revalidateTag(assetRateLastUpdatedAtTag(asset.id));
	return Promise.resolve();
}

async function refreshStockRates(
	asset: typeof AssetTable.$inferSelect,
	lastUpdatedAt: string
) {
	const stockPrices = await getStockPrices(asset.externalId!);

	const rates = stockPrices
		.filter(
			(rate) =>
				DateTime.fromFormat(rate.date, 'yyyy-MM-dd')
					.diff(DateTime.fromISO(lastUpdatedAt))
					.as('days') >= -1
		)
		.map((rate) => ({
			date: rate.date,
			rate: rate.price,
			id: asset.id,
		}));

	if (rates.length === 0) {
		return Promise.resolve();
	}

	await db.insert(AssetRateTable).values(rates).onConflictDoNothing();

	revalidateTag(assetRateLastUpdatedAtTag(asset.id));
	return Promise.resolve();
}

async function getExchangeRateLastUpdatedAt(from: Currency, to: Currency) {
	'use cache';
	cacheLife('daily');
	cacheTag(exchangeRateLastUpdatedAtTag(from, to));

	console.log('getExchangeRateLastUpdatedAt', from, to);

	const lastUpdatedAt = await db
		.select({
			lastUpdatedAt: max(ExchangeRateTable.updatedAt),
		})
		.from(ExchangeRateTable)
		.where(and(eq(ExchangeRateTable.from, from), eq(ExchangeRateTable.to, to)));

	if (lastUpdatedAt.length === 0) {
		return '1970-01-01';
	}

	return lastUpdatedAt[0].lastUpdatedAt!;
}

async function getAssetRateLastUpdatedAt(assetId: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(assetRateLastUpdatedAtTag(assetId));

	console.log('getAssetRateLastUpdatedAt', assetId);

	const lastUpdatedAt = await db
		.select({
			lastUpdatedAt: max(AssetRateTable.updatedAt),
		})
		.from(AssetRateTable)
		.where(eq(AssetRateTable.id, assetId));

	if (lastUpdatedAt.length === 0) {
		return '1970-01-01';
	}

	return lastUpdatedAt[0].lastUpdatedAt!;
}
