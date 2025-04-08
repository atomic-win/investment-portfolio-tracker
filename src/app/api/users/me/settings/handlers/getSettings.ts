import { getUserSettings } from '@/features/users/db';
import { AuthClaims } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(_req: NextRequest, claims: AuthClaims) {
	const userId = claims.userId;

	try {
		const userSettings = await getUserSettings(userId);

		return NextResponse.json(userSettings);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
