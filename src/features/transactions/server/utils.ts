import { TransactionTable } from '@/drizzle/schema';
import {
	getAssetItemCurrency,
	getAssetItemRate,
	getExchangeRate,
} from '@/features/assetItems/server/utils';
import { Currency, TransactionType } from '@/types';
import { DateTime } from 'luxon';

export async function calculateTransactionApiResponse(
	transaction: typeof TransactionTable.$inferSelect,
	currency: Currency
) {
	return {
		id: transaction.id,
		date: transaction.date,
		name: transaction.name,
		assetItemId: transaction.assetItemId,
		type: transaction.type,
		units: transaction.units,
		amount: await calculateTransactionAmount(
			transaction,
			DateTime.fromISO(transaction.date),
			currency
		),
	};
}

export async function calculateTransactionAmount(
	transaction: typeof TransactionTable.$inferSelect,
	date: DateTime,
	currency: Currency
) {
	const assetItemCurrency = await getAssetItemCurrency(transaction.assetItemId);

	const exchangeRate = await getExchangeRate(
		assetItemCurrency,
		currency,
		date.toISODate()!
	);

	if (transaction.type === TransactionType.Dividend) {
		return exchangeRate * transaction.units;
	}

	return (
		exchangeRate *
		(await getAssetItemRate(transaction.assetItemId, date.toISODate()!)) *
		transaction.units
	);
}
