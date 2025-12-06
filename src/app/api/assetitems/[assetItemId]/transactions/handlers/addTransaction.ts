import { DateTime } from 'luxon';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import {
	AddTransactionSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';
import { getAssetItem } from '@/features/assetItems/server/db';
import { transactionsTag } from '@/features/transactions/server/cacheTag';
import { addTransaction } from '@/features/transactions/server/db';
import { AuthClaims } from '@/types';

export default async function handler(
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string }> }
) {
	const userId = claims.id;
	const { assetItemId } = await ctx.params;

	try {
		const body = await req.json();

		const parsedBody = AddTransactionSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{
					error: 'Invalid request body',
					issues: parsedBody.error.errors,
				},
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
			!getApplicableTransactionTypes(assetType).includes(transactionType)
		) {
			return NextResponse.json(
				{
					error: `Transaction type ${transactionType} is not applicable for this asset item`,
				},
				{ status: 400 }
			);
		}

		await addTransaction({
			assetItemId,
			...parsedBody.data,
			date: DateTime.fromJSDate(parsedBody.data.date).toISODate()!,
		});

		revalidateTag(transactionsTag(assetItemId), 'expireNow');

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error('Error while adding transaction :', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
