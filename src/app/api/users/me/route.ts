import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/features/users/db/users';

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

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
