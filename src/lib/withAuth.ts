import { getUser } from '@/features/users/db';
import { AuthClaims } from '@/types';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET as string;
const encoder = new TextEncoder();

type Handler<TParams> = (
	req: NextRequest,
	claims: AuthClaims,
	ctx: { params: Promise<TParams> }
) => Promise<NextResponse> | NextResponse;

export function withAuth<TParams>(handler: Handler<TParams>) {
	return async (request: NextRequest, ctx: { params: Promise<TParams> }) => {
		const token =
			request.cookies.get('token')?.value ||
			request.headers.get('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		try {
			const decoded = await jwtVerify<AuthClaims>(
				token,
				encoder.encode(SECRET_KEY)
			);

			const userId = decoded.payload.id;

			if (!userId) {
				return NextResponse.json('Unauthorized', { status: 401 });
			}

			const user = await getUser(userId);

			if (!user) {
				return NextResponse.json('User not found', { status: 404 });
			}

			return handler(request, decoded.payload, ctx);
		} catch (err) {
			console.error('JWT verification failed:', err);
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}
	};
}
