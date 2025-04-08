import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { db } from '@/drizzle/db';
import { UserIdTable, UserTable } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
	const { idToken } = await req.json();

	if (!idToken) {
		return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
	}

	try {
		// Verify ID token locally
		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload || !payload.email) {
			return NextResponse.json(
				{ error: 'Invalid token payload' },
				{ status: 401 }
			);
		}

		const user = await getUser(payload);

		// Create custom JWT
		const customJwt = jwt.sign(
			{
				id: user.id,
			},
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		return NextResponse.json({ token: customJwt });
	} catch (error) {
		console.error('Token verification failed:', error);
		return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
	}
}

async function getUser(payload: TokenPayload) {
	const identityProviderUser = await db.query.UserIdTable.findFirst({
		where: and(
			eq(UserIdTable.identityProvider, 'google'),
			eq(UserIdTable.id, payload.sub)
		),
	});

	if (!identityProviderUser) {
		return await createUser(payload);
	}

	const user = await db.query.UserTable.findFirst({
		where: eq(UserTable.id, identityProviderUser.userId),
	});

	if (user) {
		return user;
	}

	return (
		await db
			.insert(UserTable)
			.values({
				email: payload.email!,
				fullName: payload.name!,
			})
			.returning()
	)[0];
}

async function createUser(payload: TokenPayload) {
	return await db.transaction(async (tx) => {
		const user = (
			await tx
				.insert(UserTable)
				.values({
					email: payload.email!,
					fullName: payload.name!,
				})
				.returning()
		)[0];

		await tx
			.insert(UserIdTable)
			.values({
				id: payload.sub,
				identityProvider: 'google',
				userId: user.id,
			})
			.returning();

		return user;
	});
}
