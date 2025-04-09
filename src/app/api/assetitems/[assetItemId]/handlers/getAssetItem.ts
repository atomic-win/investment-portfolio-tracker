import { NextRequest, NextResponse } from 'next/server';
import { AuthClaims } from '@/types';
import { getAssetItem } from '@/features/assetItems/db';

export default async function handler(
	_req: NextRequest,
	claims: AuthClaims,
	ctx: { params: { assetItemId: string } }
) {
	const userId = claims.id;

	try {
		const assetItem = getAssetItem(userId, ctx.params.assetItemId);
		return NextResponse.json(assetItem);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
