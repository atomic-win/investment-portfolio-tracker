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

export async function getAssetItemCurrency(assetItemId: string) {
	'use cache';
	const asset = await getAsset(assetItemId);
	return asset.currency;
}

export async function getAssetItemRate(assetItemId: string, date: string) {
	'use cache';

	const asset = await getAsset(assetItemId);
	return getAssetRate(asset, date);
}

export async function getExchangeRate(
	from: Currency,
	to: Currency,
	date: string
) {
	'use cache';

	if (from === to) {
		return 1;
	}

	const lastUpdatedAt = await db
		.select({
			lastUpdatedAt: max(ExchangeRateTable.updatedAt),
		})
		.from(ExchangeRateTable)
		.where(and(eq(ExchangeRateTable.from, from), eq(ExchangeRateTable.to, to)));

	if (
		!!!lastUpdatedAt ||
		lastUpdatedAt.length === 0 ||
		!!!lastUpdatedAt[0].lastUpdatedAt ||
		DateTime.utc()
			.diff(DateTime.fromISO(lastUpdatedAt[0].lastUpdatedAt))
			.as('days') > 1
	) {
		await refreshExchangeRates(from, to);
	}

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

	const assetType = asset.type;

	if (assetType !== AssetType.MutualFund && assetType !== AssetType.Stock) {
		return 1;
	}

	const lastUpdatedAt = await db
		.select({
			lastUpdatedAt: max(AssetRateTable.updatedAt),
		})
		.from(AssetRateTable)
		.where(eq(AssetRateTable.id, asset.id));

	if (
		!!!lastUpdatedAt ||
		lastUpdatedAt.length === 0 ||
		!!!lastUpdatedAt[0].lastUpdatedAt ||
		DateTime.utc()
			.diff(DateTime.fromISO(lastUpdatedAt[0].lastUpdatedAt))
			.as('days') > 1
	) {
		await refreshAssetRates(asset);
	}

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

function refreshAssetRates(asset: typeof AssetTable.$inferSelect) {
	const assetType = asset.type;

	if (assetType === AssetType.MutualFund) {
		return refreshMutualFundRates(asset);
	}

	return refreshStockRates(asset);
}

async function refreshMutualFundRates(asset: typeof AssetTable.$inferSelect) {
	const mfApiResponse = await getMutualFundNav(Number(asset.externalId));

	const rates = mfApiResponse!.data!.map((rate) => ({
		id: asset.id,
		date: DateTime.fromFormat(rate.date, 'dd-MM-yyyy').toFormat('yyyy-MM-dd'),
		rate: Number(rate.nav),
	}));

	return db.insert(AssetRateTable).values(rates).onConflictDoNothing();
}

async function refreshStockRates(asset: typeof AssetTable.$inferSelect) {
	const stockPrices = await getStockPrices(asset.externalId!);

	const rates = stockPrices.map((rate) => ({
		date: rate.date,
		rate: rate.price,
		id: asset.id,
	}));

	return db.insert(AssetRateTable).values(rates).onConflictDoNothing();
}

async function refreshExchangeRates(from: Currency, to: Currency) {
	const stockPrices = await getExchangeRates(from, to);

	const rates = stockPrices.map((rate) => ({
		from,
		to,
		...rate,
	}));

	return db.insert(ExchangeRateTable).values(rates).onConflictDoNothing();
}
