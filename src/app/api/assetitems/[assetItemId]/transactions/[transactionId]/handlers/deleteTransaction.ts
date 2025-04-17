import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims } from '@/types';
import { getAssetItem } from '@/features/assetItems/server/db';
import {
	deleteTransaction,
	getTransaction,
} from '@/features/transactions/server/db';

export default async function handler(
	_req: NextRequest,
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

		await deleteTransaction(transactionId);

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
