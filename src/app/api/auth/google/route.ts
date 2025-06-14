import { and, eq } from 'drizzle-orm';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { UserIdTable, UserSettingTable, UserTable } from '@/drizzle/schema';
import { getUser } from '@/features/users/db';
import { IdentityProvider } from '@/types';

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

		try {
			const user = await getUserByPayload(payload);

			try {
				// Create custom JWT
				const customJwt = jwt.sign(
					{
						id: user.id,
					},
					JWT_SECRET,
					{ expiresIn: '1h' }
				);

				return NextResponse.json({ accessToken: customJwt });
			} catch (error) {
				console.error('JWT creation failed:', error);
				return NextResponse.json(
					{ error: 'Failed to create JWT' },
					{ status: 500 }
				);
			}
		} catch (error) {
			console.error('User retrieval failed:', error);
			return NextResponse.json(
				{ error: 'Failed to retrieve user' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Token verification failed:', error);
		return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
	}
}

async function getUserByPayload(payload: TokenPayload) {
	const identityProviderUser = await db.query.UserIdTable.findFirst({
		where: and(
			eq(UserIdTable.identityProvider, IdentityProvider.Google),
			eq(UserIdTable.id, payload.sub)
		),
	});

	if (identityProviderUser) {
		return (await getUser(identityProviderUser.userId))!;
	}

	return await createUser(payload)!;
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
				identityProvider: IdentityProvider.Google,
				userId: user.id,
			})
			.returning();

		await tx
			.insert(UserSettingTable)
			.values({
				id: user.id,
			})
			.returning();

		return user;
	});
}
