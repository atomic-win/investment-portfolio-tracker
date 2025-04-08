import { db } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { getUserTag } from './cache/users';

export async function getUser(userId: string) {
	'use cache';

	cacheTag(getUserTag(userId));

	return await db
		.select({
			id: UserTable.id,
			fullName: UserTable.fullName,
			email: UserTable.email,
		})
		.from(UserTable)
		.where(eq(UserTable.id, userId))
		.get();
}
