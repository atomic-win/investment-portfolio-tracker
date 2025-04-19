import { AssetType } from '@/types';

export function assetItemsTag(userId: string) {
	return `users/${userId}/assetItems/all`;
}

export function assetItemTag(userId: string, assetItemId: string) {
	return `users/${userId}/assetItems/${assetItemId}`;
}

export function assetIdTag(assetType: AssetType, externalId: string) {
	return `assetId/${assetType}/${externalId}`;
}
