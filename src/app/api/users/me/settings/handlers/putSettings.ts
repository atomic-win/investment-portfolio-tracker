import { NextRequest, NextResponse } from 'next/server';
import { updateUserSettings } from '@/features/users/db';
import { AuthClaims, Currency, Language } from '@/types';

export default async function handler(req: NextRequest, claims: AuthClaims) {
	const userId = claims.userId;

	try {
		const body = (await req.json()) as {
			currency?: Currency;
			language?: Language;
		};

		if (!body) {
			return NextResponse.json('Invalid request body', { status: 400 });
		}

		await updateUserSettings(userId, {
			...body,
			id: userId,
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
