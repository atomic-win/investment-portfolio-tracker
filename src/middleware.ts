// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;
const EXCLUDE_PATHS = ['/api/auth/'];

export function middleware(request: NextRequest) {
	// Skip middleware for excluded paths
	if (EXCLUDE_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
		return NextResponse.next();
	}

	const token =
		request.cookies.get('token')?.value ||
		request.headers.get('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);

		// You can forward the user info via headers
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set('x-user-id', (decoded as { id: string }).id);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	} catch (err) {
		console.error('JWT verification failed:', err);
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}
}

export const config = {
	matcher: ['/api/:path*'], // broadly match all API routes
};
