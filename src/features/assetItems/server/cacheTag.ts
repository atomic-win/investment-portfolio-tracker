import { AssetType, Currency } from '@/types';

export function assetItemsTag(userId: string) {
	return `users/${userId}/assetItems/all`;
}

export function assetItemTag(userId: string, assetItemId: string) {
	return `users/${userId}/assetItems/${assetItemId}`;
}

export function assetIdTag(assetType: AssetType, externalId: string) {
	return `assetId/${assetType}/${externalId}`;
}

export function assetRateLastUpdatedAtTag(assetId: string) {
	return `assets/${assetId}/lastUpdatedAt`;
}

export function exchangeRateLastUpdatedAtTag(from: Currency, to: Currency) {
	return `exchangeRates/${from}/${to}/lastUpdatedAt`;
}
