import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAssetItem } from '@/features/assetItems/server/db';
import { getTransaction } from '@/features/transactions/server/db';
import { calculateTransactionApiResponse } from '@/features/transactions/server/utils';
import { AuthClaims, Currency } from '@/types';

export default async function handler(
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string; transactionId: string }> }
) {
	const userId = claims.id;
	const { assetItemId, transactionId } = await ctx.params;
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

		const transaction = await getTransaction(assetItemId, transactionId);

		if (!transaction) {
			return NextResponse.json('Transaction not found', { status: 404 });
		}

		return NextResponse.json(
			await calculateTransactionApiResponse(transaction[0], currency)
		);
	} catch (error) {
		console.error('Error while fetching transaction:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
