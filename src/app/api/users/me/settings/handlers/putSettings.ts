import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { updateUserSettings } from '@/features/users/db';
import { AuthClaims, Currency, Language } from '@/types';

const SettingsSchema = z.object({
	currency: z.nativeEnum(Currency).optional(),
	language: z.nativeEnum(Language).optional(),
});

export default async function handler(req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;

	try {
		const body = await req.json();

		const parsedBody = SettingsSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{ error: 'Invalid request body', issues: parsedBody.error.errors },
				{ status: 400 }
			);
		}

		await updateUserSettings(userId, {
			...parsedBody.data,
			id: userId,
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
