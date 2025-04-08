import { NextRequest, NextResponse } from 'next/server';
import {
	getUser,
	getUserSettings,
	updateUserSettings,
} from '@/features/users/db';
import { Currency, Language } from '@/types';

export async function GET(req: NextRequest) {
	const userId = req.headers.get('x-user-id');

	if (!userId) {
		return NextResponse.json('Unauthorized', { status: 401 });
	}

	try {
		const user = await getUser(userId);

		if (!user) {
			return NextResponse.json('User not found', { status: 404 });
		}

		const userSettings = await getUserSettings(userId);

		return NextResponse.json(userSettings);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const userId = req.headers.get('x-user-id');

	if (!userId) {
		return NextResponse.json('Unauthorized', { status: 401 });
	}

	try {
		const user = await getUser(userId);

		if (!user) {
			return NextResponse.json('User not found', { status: 404 });
		}

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
