import {
	useQueries,
	experimental_streamedQuery as streamedQuery,
} from '@tanstack/react-query';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { AssetItem, Valuation } from '@/types';

export default function useValuationsQueries(
	assetItems: AssetItem[],
	assetItemIds: string[] | undefined,
	currency: string | undefined,
	idSelector: (assetItem: AssetItem) => string,
) {
	const primalApiClient = usePrimalApiClient();
	assetItemIds = (assetItemIds || []).sort();
	assetItems = assetItems || [];

	const queryInputs = getQueryInputs(assetItems, assetItemIds, idSelector);

	return useQueries({
		queries: queryInputs.map(({ id, assetItemIds }) => ({
			queryKey: [
				'valuations',
				{
					assetItemIds,
					currency,
				},
			],
			queryFn: streamedQuery({
				streamFn: () => {
					return {
						async *[Symbol.asyncIterator]() {
							const response = await primalApiClient.get(
								`assetItems/valuations?${assetItemIds
									.map((id) => `assetItemIds=${id}`)
									.join('&')}&currency=${currency}`,
								{
									responseType: 'stream',
									adapter: 'fetch',
								},
							);

							const stream = response.data;
							const reader = stream
								.pipeThrough(new TextDecoderStream())
								.getReader();

							while (true) {
								const { done, value } = await reader.read();
								if (done) break;
								for (const line of value
									.split('\n')
									.filter(
										(line: string) => line.trim() !== '',
									)) {
									yield {
										...(JSON.parse(line) as Valuation),
										id,
									} as Valuation;
								}
							}
						},
					};
				},
			}),
			enabled:
				!!currency && assetItemIds.length > 0 && assetItems.length > 0,
		})),
	});
}

function getQueryInputs(
	assetItems: AssetItem[],
	assetItemIds: string[],
	idSelector: (assetItem: AssetItem) => string,
): { id: string; assetItemIds: string[] }[] {
	const idToAssetItemIds = new Map<string, string[]>();

	for (const assetItemId of assetItemIds) {
		const assetItem = assetItems.find((x) => x.id === assetItemId)!;

		const id = idSelector(assetItem);

		if (!idToAssetItemIds.has(id)) {
			idToAssetItemIds.set(id, []);
		}

		idToAssetItemIds.get(id)!.push(assetItemId);
	}

	return Array.from(idToAssetItemIds.entries()).map(([id, assetItemIds]) => ({
		id,
		assetItemIds,
	}));
}
