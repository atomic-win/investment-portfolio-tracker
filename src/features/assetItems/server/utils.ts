import { db } from '@/drizzle/db';
import {
	AssetItemTable,
	AssetRateTable,
	AssetTable,
	ExchangeRateTable,
} from '@/drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';
import { desc, max } from 'drizzle-orm/sql';
import { AssetType, Currency } from '@/types';
import { DateTime } from 'luxon';
import { assert } from 'console';
import { getMutualFundNav } from '@/services/mfApiService';
import { getStockPrices } from '@/services/stockApiService';
import { getExchangeRates } from '@/services/exchangeRateApiService';

export async function getAssetItemRate(
	assetItemId: string,
	currency: Currency,
	date: DateTime
) {
	const assetItem = await db
		.select()
		.from(AssetItemTable)
		.where(eq(AssetItemTable.id, assetItemId));

	const asset = await db
		.select()
		.from(AssetTable)
		.where(eq(AssetTable.id, assetItem[0].assetId));

	return getAssetRate(asset[0], currency, date);
}

async function getAssetRate(
	asset: typeof AssetTable.$inferSelect,
	currency: Currency,
	date: DateTime
) {
	const assetType = asset.type;

	if (assetType !== AssetType.MutualFunds && assetType !== AssetType.Stocks) {
		return getExchangeRate(asset.currency, currency, date);
	}

	return (
		(await getAssetRateInOriginalCurrency(asset, date)) *
		(await getExchangeRate(asset.currency, currency, date))
	);
}

async function getExchangeRate(from: Currency, to: Currency, date: DateTime) {
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
				gte(
					ExchangeRateTable.date,
					date.minus({ days: 7 }).toFormat('yyyy-MM-dd')
				)
			)
		)
		.orderBy(desc(ExchangeRateTable.date))
		.limit(1);

	return rates[0].rate;
}

async function getAssetRateInOriginalCurrency(
	asset: typeof AssetTable.$inferSelect,
	date: DateTime
) {
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
			rate: AssetRateTable.rate,
		})
		.from(AssetRateTable)
		.where(
			and(
				eq(AssetRateTable.id, asset.id),
				gte(AssetRateTable.date, date.minus({ days: 7 }).toFormat('yyyy-MM-dd'))
			)
		)
		.orderBy(desc(AssetRateTable.date))
		.limit(1);

	return rates[0].rate;
}

async function refreshExchangeRates(from: Currency, to: Currency) {
	const stockPrices = await getExchangeRates(from, to);

	const rates = stockPrices.map((rate) => ({
		from,
		to,
		...rate,
	}));

	await db.insert(ExchangeRateTable).values(rates).onConflictDoNothing();
}

function refreshAssetRates(asset: typeof AssetTable.$inferSelect) {
	const assetType = asset.type;

	if (assetType === AssetType.MutualFunds) {
		return refreshMutualFundRates(asset);
	}

	if (assetType === AssetType.Stocks) {
		return refreshStockRates(asset);
	}

	assert(false, 'refreshAssetRates: Unknown asset type');
}

async function refreshMutualFundRates(asset: typeof AssetTable.$inferSelect) {
	const mfApiResponse = await getMutualFundNav(Number(asset.externalId));

	const rates = mfApiResponse!.data!.map((rate) => ({
		id: asset.id,
		date: DateTime.fromFormat(rate.date, 'dd-MM-yyyy').toFormat('yyyy-MM-dd'),
		rate: Number(rate.nav),
	}));

	await db.insert(AssetRateTable).values(rates).onConflictDoNothing();
}

async function refreshStockRates(asset: typeof AssetTable.$inferSelect) {
	const stockPrices = await getStockPrices(asset.externalId!);

	const rates = stockPrices.map((rate) => ({
		date: rate.date,
		rate: rate.price,
		id: asset.id,
	}));

	await db.insert(AssetRateTable).values(rates).onConflictDoNothing();
}
