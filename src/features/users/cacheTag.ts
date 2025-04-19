export function getUserTag(userId: string) {
	return `users/${userId}`;
}

export function getUserSettingsTag(userId: string) {
	return `${getUserTag(userId)}/settings`;
}
