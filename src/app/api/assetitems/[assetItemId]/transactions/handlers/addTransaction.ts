import { NextRequest, NextResponse } from 'next/server';
import { AssetType, AuthClaims, TransactionType } from '@/types';
import { z } from 'zod';
import { getAssetItem } from '@/features/assetItems/server/db';
import { DateTime } from 'luxon';
import { addTransaction } from '@/features/transactions/server/db';
import { unstable_expireTag as expireTag } from 'next/cache';
import { transactionsTag } from '@/features/transactions/server/cacheTag';

const format = 'yyyy-MM-dd';

const TransactionSchema = z
	.object({
		date: z.string(),
		name: z.string().min(3).max(1000),
		type: z.nativeEnum(TransactionType),
		units: z.number().positive(),
	})
	.refine((data) => DateTime.fromFormat(data.date, format).isValid, {
		message: 'Invalid date format. Expected format: yyyy-MM-dd',
	});

export default async function handler(
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string }> }
) {
	const userId = claims.id;
	const { assetItemId } = await ctx.params;

	try {
		const body = await req.json();

		const parsedBody = TransactionSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{ error: 'Invalid request body', issues: parsedBody.error.errors },
				{ status: 400 }
			);
		}

		const assetItem = await getAssetItem(userId, assetItemId);

		if (!assetItem) {
			return NextResponse.json('Asset item not found', { status: 404 });
		}

		const assetType = assetItem.assetType;
		const transactionType = parsedBody.data.type;

		if (
			assetType === AssetType.MutualFund &&
			transactionType !== TransactionType.Buy &&
			transactionType !== TransactionType.Sell
		) {
			return NextResponse.json(
				'Invalid transaction type for Mutual Funds. Only Buy and Sell are allowed.',
				{ status: 400 }
			);
		}

		if (
			assetType === AssetType.Stock &&
			transactionType !== TransactionType.Buy &&
			transactionType !== TransactionType.Sell &&
			transactionType !== TransactionType.Dividend
		) {
			return NextResponse.json(
				'Invalid transaction type for Stocks. Only Buy, Sell and Dividend are allowed.',
				{ status: 400 }
			);
		}

		if (
			(assetType === AssetType.CashAccount ||
				assetType === AssetType.FixedDeposit ||
				assetType === AssetType.EPF ||
				assetType === AssetType.PPF) &&
			transactionType !== TransactionType.Deposit &&
			transactionType !== TransactionType.Withdrawal &&
			transactionType !== TransactionType.Interest &&
			transactionType !== TransactionType.SelfInterest &&
			transactionType !== TransactionType.InterestPenalty
		) {
			return NextResponse.json(
				`Invalid transaction type for ${assetType}. Only Deposit, Withdrawal, Interest, Self Interest and Interest Penalty are allowed.`,
				{ status: 400 }
			);
		}

		await addTransaction({
			assetItemId,
			...parsedBody.data,
		});

		expireTag(transactionsTag(assetItemId));

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error('Error while adding transaction :', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
