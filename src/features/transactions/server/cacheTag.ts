export function transactionsTag(assetItemId: string) {
	return `assetItems/${assetItemId}/transactions/all`;
}

export function transactionTag(assetItemId: string, id: string) {
	return `assetItems/${assetItemId}/transactions/${id}`;
}
