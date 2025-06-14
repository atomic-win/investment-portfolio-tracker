import { NextRequest, NextResponse } from 'next/server';

import { getAllAssetItems } from '@/features/assetItems/server/db';
import { AuthClaims } from '@/types';

export default async function handler(_req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;

	try {
		return NextResponse.json(await getAllAssetItems(userId));
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
