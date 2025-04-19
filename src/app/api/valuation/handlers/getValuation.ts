import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims, Currency, TransactionType } from '@/types';
import { getAssetItem } from '@/features/assetItems/server/db';
import { getAllTransactions } from '@/features/transactions/server/db';
import { z } from 'zod';
import { calculateTransactionAmount } from '@/features/transactions/server/utils';
import { DateTime } from 'luxon';
import { TransactionTable } from '@/drizzle/schema';
import _ from 'lodash';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';

const dateFormat = 'yyyy-MM-dd';

export default async function handler(req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;
	const { searchParams } = new URL(req.url);

	const assetItemIds = searchParams.getAll('assetItemId') || [];

	if (assetItemIds.length === 0) {
		return NextResponse.json('Asset item ID is required', { status: 400 });
	}

	const evaluationDate = searchParams.get('date');

	if (
		!!!evaluationDate ||
		!DateTime.fromFormat(evaluationDate, dateFormat).isValid
	) {
		return NextResponse.json(
			'Invalid date format. Expected format: yyyy-MM-dd',
			{ status: 400 }
		);
	}

	if (searchParams.get('currency') === null) {
		return NextResponse.json('Currency is required', { status: 400 });
	}

	const parsed_data = z
		.nativeEnum(Currency)
		.safeParse(searchParams.get('currency'));

	if (!parsed_data.success) {
		return NextResponse.json('Invalid currency', { status: 400 });
	}

	const currency = parsed_data.data;

	try {
		for (const assetItemId of assetItemIds) {
			const assetItem = await getAssetItem(userId, assetItemId);

			if (!assetItem) {
				return NextResponse.json('Asset item not found', { status: 404 });
			}
		}

		const assetItemValuations = await Promise.all(
			assetItemIds.map(
				async (assetItemId) =>
					await calculateAssetItemValuation(
						assetItemId,
						evaluationDate,
						currency
					)
			)
		);

		return NextResponse.json({
			investedValue: assetItemValuations.reduce(
				(acc, item) => acc + item.investedValue,
				0
			),
			currentValue: assetItemValuations.reduce(
				(acc, item) => acc + item.currentValue,
				0
			),
			xirrPercent:
				100 *
				calculateXIRR(assetItemValuations.flatMap((item) => item.xirrInputs)),
		});
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}

async function calculateAssetItemValuation(
	assetItemId: string,
	evaluationDate: string,
	currency: Currency
) {
	'use cache';
	cacheLife('daily');

	const transactions = await getAllTransactions(assetItemId, evaluationDate);

	const xirrInputs = await Promise.all(
		transactions.map(async (transaction) => ({
			yearDiff: DateTime.fromISO(evaluationDate).diff(
				DateTime.fromISO(transaction.date),
				'years'
			).years,
			transactionAmount: await calculateXIRRTransactionAmount(
				transaction,
				evaluationDate,
				currency
			),
			balanceAmount: await calculateXIRRBalanceAmount(
				transaction,
				evaluationDate,
				currency
			),
		}))
	);

	return {
		investedValue: await calculateInvestedValue(
			transactions,
			evaluationDate,
			currency
		),
		currentValue: await calculateCurrentValue(
			transactions,
			evaluationDate,
			currency
		),
		xirrInputs,
	};
}

function calculateXIRR(
	xirrInputs: {
		yearDiff: number;
		transactionAmount: number;
		balanceAmount: number;
	}[]
) {
	if (xirrInputs.length === 0) {
		return 0;
	}

	const balanceAmount = xirrInputs.reduce(
		(acc, item) => acc + item.balanceAmount,
		0
	);

	let inValues = xirrInputs.map((item) => ({
		yearDiff: item.yearDiff,
		value: item.transactionAmount,
	}));

	const allLessThanYear = inValues.every((item) => item.yearDiff < 1);

	if (allLessThanYear && balanceAmount != 0) {
		inValues = inValues.map((item) => ({
			yearDiff: 1,
			value: item.value,
		}));
	}

	let xirrLowerBound = -1,
		xirrUpperBound = 100;

	while (xirrUpperBound - xirrLowerBound > 0.0000001) {
		const xirr = (xirrLowerBound + xirrUpperBound) / 2;
		const npv = inValues.reduce(
			(acc, item) => acc + item.value * Math.pow(1 + xirr, item.yearDiff),
			0
		);

		if (npv > balanceAmount) {
			xirrUpperBound = xirr;
		} else {
			xirrLowerBound = xirr;
		}
	}

	if (xirrUpperBound - xirrLowerBound <= 0.0000001) {
		return xirrUpperBound;
	} else {
		return 0;
	}
}

async function calculateXIRRTransactionAmount(
	transaction: typeof TransactionTable.$inferSelect,
	evaluationDate: string,
	currency: Currency
) {
	switch (transaction.type) {
		case TransactionType.Buy:
		case TransactionType.Deposit:
		case TransactionType.InterestPenalty:
			return await calculateInitialAmount(
				transaction,
				evaluationDate,
				currency
			);
		case TransactionType.Sell:
		case TransactionType.Withdrawal:
		case TransactionType.Interest:
		case TransactionType.Dividend:
			return -(await calculateInitialAmount(
				transaction,
				evaluationDate,
				currency
			));
		default:
			return 0;
	}
}

async function calculateXIRRBalanceAmount(
	transaction: typeof TransactionTable.$inferSelect,
	evaluationDate: string,
	currency: Currency
) {
	switch (transaction.type) {
		case TransactionType.Buy:
		case TransactionType.Deposit:
		case TransactionType.SelfInterest:
			return await calculateCurrentAmount(
				transaction,
				evaluationDate,
				currency
			);
		case TransactionType.Sell:
		case TransactionType.Withdrawal:
		case TransactionType.InterestPenalty:
			return -(await calculateCurrentAmount(
				transaction,
				evaluationDate,
				currency
			));
		default:
			return 0;
	}
}

async function calculateInvestedValue(
	transactions: (typeof TransactionTable.$inferSelect)[],
	evaluationDate: string,
	currency: Currency
) {
	let withdrawnCashUnits = transactions
		.filter(
			(transaction) =>
				transaction.type === TransactionType.Withdrawal ||
				transaction.type === TransactionType.InterestPenalty
		)
		.reduce((acc, transaction) => acc + transaction.units, 0);

	let withdrawnNonCashUnits = transactions
		.filter((transaction) => transaction.type === TransactionType.Sell)
		.reduce((acc, transaction) => acc + transaction.units, 0);

	let investedValue = 0;

	for (const transaction of _.sortBy(transactions, ['date'], ['desc'])) {
		if (transaction.type === TransactionType.Deposit) {
			const units =
				transaction.units - Math.min(withdrawnCashUnits, transaction.units);

			withdrawnCashUnits -= transaction.units - units;

			investedValue += await calculateInitialAmount(
				{
					...transaction,
					units,
				},
				evaluationDate,
				currency
			);

			continue;
		}

		if (transaction.type === TransactionType.Buy) {
			const units =
				transaction.units - Math.min(withdrawnNonCashUnits, transaction.units);

			withdrawnNonCashUnits -= transaction.units - units;

			investedValue += await calculateInitialAmount(
				{
					...transaction,
					units,
				},
				evaluationDate,
				currency
			);

			continue;
		}
	}

	return investedValue;
}

async function calculateCurrentValue(
	transactions: (typeof TransactionTable.$inferSelect)[],
	evaluationDate: string,
	currency: Currency
) {
	return (
		await Promise.all(
			transactions.map(async (transaction) => {
				switch (transaction.type) {
					case TransactionType.Buy:
					case TransactionType.Deposit:
					case TransactionType.SelfInterest:
						return await calculateCurrentAmount(
							transaction,
							evaluationDate,
							currency
						);
					case TransactionType.Sell:
						return -(await calculateInitialAmount(
							transaction,
							evaluationDate,
							currency
						));
					case TransactionType.Withdrawal:
					case TransactionType.InterestPenalty:
						return -(await calculateCurrentAmount(
							transaction,
							evaluationDate,
							currency
						));
					default:
						return 0;
				}
			})
		)
	).reduce((acc, item) => acc + item, 0);
}

async function calculateInitialAmount(
	transaction: typeof TransactionTable.$inferSelect,
	evaluationDate: string,
	currency: Currency
) {
	if (
		transaction.type === TransactionType.Deposit ||
		transaction.type === TransactionType.Withdrawal
	) {
		return await calculateCurrentAmount(transaction, evaluationDate, currency);
	}

	return calculateTransactionAmount(transaction, transaction.date, currency);
}

function calculateCurrentAmount(
	transaction: typeof TransactionTable.$inferSelect,
	evaluationDate: string,
	currency: Currency
) {
	return calculateTransactionAmount(transaction, evaluationDate, currency);
}
