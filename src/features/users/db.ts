import { db } from '@/drizzle/db';
import { UserSettingTable, UserTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { getUserSettingsTag, getUserTag } from './cacheTag';
import { revalidateTag } from 'next/cache';

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
		.where(eq(UserTable.id, userId));
}

export async function getUserSettings(userId: string) {
	'use cache';

	cacheTag(getUserSettingsTag(userId));

	return await db
		.select({
			currency: UserSettingTable.currency,
			language: UserSettingTable.language,
		})
		.from(UserSettingTable)
		.where(eq(UserSettingTable.id, userId));
}

export async function updateUserSettings(
	id: string,
	data: typeof UserSettingTable.$inferInsert
) {
	const updatedUserSettings = await db
		.update(UserSettingTable)
		.set(data)
		.where(eq(UserSettingTable.id, id))
		.returning();

	if (updatedUserSettings == null) {
		throw new Error('Failed to update user settings');
	}

	revalidateTag(getUserSettingsTag(id));

	return updatedUserSettings;
}
