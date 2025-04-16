import { TransactionTable } from '@/drizzle/schema';
import { getAssetItemRate } from '@/features/assetItems/server/utils';
import { Currency } from '@/types';
import { DateTime } from 'luxon';

export async function calculateTransactionApiResponse(
	transaction: typeof TransactionTable.$inferSelect,
	currency: Currency
) {
	const amount = await calculateTransactionAmount(
		transaction,
		currency,
		DateTime.fromISO(transaction.date)
	);

	return {
		id: transaction.id,
		date: transaction.date,
		name: transaction.name,
		assetItemId: transaction.assetItemId,
		type: transaction.type,
		units: transaction.units,
		amount,
	};
}

export async function calculateTransactionAmount(
	transaction: typeof TransactionTable.$inferSelect,
	currency: Currency,
	date: DateTime
) {
	return (
		(await getAssetItemRate(transaction.assetItemId, currency, date)) *
		transaction.units
	);
}
