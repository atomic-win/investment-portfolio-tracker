import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims } from '@/types';
import { getAssetItem } from '@/features/assetItems/server/db';

export default async function handler(
	_req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<{ assetItemId: string }> }
) {
	const userId = claims.id;
	const { assetItemId } = await ctx.params;

	try {
		const assetItem = await getAssetItem(userId, assetItemId);

		if (!assetItem) {
			return NextResponse.json('Asset item not found', { status: 404 });
		}

		return NextResponse.json(assetItem);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
