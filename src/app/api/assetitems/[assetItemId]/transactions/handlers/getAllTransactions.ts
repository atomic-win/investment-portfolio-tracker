import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims, Currency } from '@/types';
import { getAssetItem } from '@/features/assetItems/server/db';
import { getAllTransactions } from '@/features/transactions/server/db';
import { z } from 'zod';
import { calculateTransactionApiResponse } from '@/features/transactions/server/utils';
import { DateTime } from 'luxon';

export default async function handler(
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string }> }
) {
	const userId = claims.id;
	const { assetItemId } = await ctx.params;
	const { searchParams } = new URL(req.url);

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
		const assetItem = await getAssetItem(userId, assetItemId);

		if (!assetItem) {
			return NextResponse.json('Asset item not found', { status: 404 });
		}

		const transactions = await Promise.all(
			(
				await getAllTransactions(assetItemId, DateTime.utc().plus({ days: 1 }))
			).map(
				async (transaction) =>
					await calculateTransactionApiResponse(transaction, currency)
			)
		);

		return NextResponse.json(transactions);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
