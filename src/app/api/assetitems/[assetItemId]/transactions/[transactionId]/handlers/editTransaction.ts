import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import {
	EditTransactionSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';
import { getAssetItem } from '@/features/assetItems/server/db';
import {
	transactionsTag,
	transactionTag,
} from '@/features/transactions/server/cacheTag';
import {
	editTransaction,
	getTransaction,
} from '@/features/transactions/server/db';
import { AuthClaims } from '@/types';

export default async function handler(
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string; transactionId: string }> }
) {
	const userId = claims.id;
	const { assetItemId, transactionId } = await ctx.params;

	try {
		const assetItem = await getAssetItem(userId, assetItemId);

		if (!assetItem) {
			return NextResponse.json('Asset item not found', { status: 404 });
		}

		const transaction = await getTransaction(assetItemId, transactionId);

		if (!transaction) {
			return NextResponse.json('Transaction not found', { status: 404 });
		}

		const body = await req.json();

		const parsedBody = EditTransactionSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{
					error: 'Invalid request body',
					issues: parsedBody.error.errors,
				},
				{ status: 400 }
			);
		}

		const assetType = assetItem.assetType;
		const transactionType = parsedBody.data.type;

		if (
			transactionType !== undefined &&
			!getApplicableTransactionTypes(assetType).includes(transactionType!)
		) {
			return NextResponse.json(
				{
					error: `Transaction type ${transactionType} is not applicable for this asset item`,
				},
				{ status: 400 }
			);
		}

		await editTransaction(transactionId, parsedBody.data);

		revalidateTag(transactionsTag(assetItemId), 'max');
		revalidateTag(transactionTag(assetItemId, transactionId), 'max');

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error('Error while editing transaction :', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
