import { db } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
	const userId = req.headers.get('x-user-id');

	if (!userId) {
		return NextResponse.json('Unauthorized', { status: 401 });
	}

	try {
		const user = await db
			.select({
				id: UserTable.id,
				name: UserTable.fullName,
			})
			.from(UserTable)
			.where(eq(UserTable.id, userId))
			.get();

		if (!user) {
			return NextResponse.json('User not found', { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}
