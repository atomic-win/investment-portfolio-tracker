import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/features/users/db';
import { AuthClaims } from '@/types';

export default async function handler(_req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;

	console.log('userId', userId);

	try {
		const user = await getUser(userId);
		return NextResponse.json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
