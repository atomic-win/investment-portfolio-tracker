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

export function getAssetItemRate(
	assetItemId: string,
	currency: Currency,
	date: DateTime
) {
	const assetItem = db
		.select()
		.from(AssetItemTable)
		.where(eq(AssetItemTable.id, assetItemId))
		.get()!;

	const asset = db
		.select()
		.from(AssetTable)
		.where(eq(AssetTable.id, assetItem.assetId))
		.get()!;

	return getAssetRate(asset, currency, date);
}

function getAssetRate(
	asset: typeof AssetTable.$inferSelect,
	currency: Currency,
	date: DateTime
) {
	const assetType = asset.type;

	if (assetType !== AssetType.MutualFunds && assetType !== AssetType.Stocks) {
		return getExchangeRate(asset.currency, currency, date);
	}

	return (
		getAssetRateInOriginalCurrency(asset, date) *
		getExchangeRate(asset.currency, currency, date)
	);
}

function getExchangeRate(from: Currency, to: Currency, date: DateTime) {
	const { lastUpdatedAt } = db
		.select({
			lastUpdatedAt: max(ExchangeRateTable.updatedAt),
		})
		.from(ExchangeRateTable)
		.where(and(eq(ExchangeRateTable.from, from), eq(ExchangeRateTable.to, to)))
		.get()!;

	if (
		!!!lastUpdatedAt ||
		DateTime.utc().diff(DateTime.fromISO(lastUpdatedAt)).as('days') > 1
	) {
		refreshExchangeRates(from, to);
	}

	return db
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
		.limit(1)
		.get()!.rate;
}

function getAssetRateInOriginalCurrency(
	asset: typeof AssetTable.$inferSelect,
	date: DateTime
) {
	const { lastUpdatedAt } = db
		.select({
			lastUpdatedAt: max(AssetRateTable.updatedAt),
		})
		.from(AssetRateTable)
		.where(eq(AssetRateTable.id, asset.id))
		.get()!;

	if (
		!!!lastUpdatedAt ||
		DateTime.utc().diff(DateTime.fromISO(lastUpdatedAt)).as('days') > 1
	) {
		refreshAssetRates(asset);
	}

	return db
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
		.limit(1)
		.get()!.rate;
}

function refreshExchangeRates(from: Currency, to: Currency) {}

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

function refreshMutualFundRates(asset: typeof AssetTable.$inferSelect) {
	assert(false, 'Not implemented yet');
}

function refreshStockRates(asset: typeof AssetTable.$inferSelect) {
	assert(false, 'Not implemented yet');
}
