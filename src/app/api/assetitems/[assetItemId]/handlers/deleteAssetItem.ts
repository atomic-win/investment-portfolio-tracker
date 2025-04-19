import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims } from '@/types';
import { deleteAssetItem, getAssetItem } from '@/features/assetItems/server/db';
import { unstable_expireTag as expireTag } from 'next/cache';
import {
	assetItemsTag,
	assetItemTag,
} from '@/features/assetItems/server/cacheTag';

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

		await deleteAssetItem(assetItemId);

		expireTag(assetItemsTag(userId));
		expireTag(assetItemTag(userId, assetItemId));

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
