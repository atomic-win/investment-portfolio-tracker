import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQueries } from '@tanstack/react-query';
import { AssetItem, Valuation } from '@/types';
import { DateTime } from 'luxon';

export default function useValuationQueries(
	assetItems: AssetItem[],
	assetItemIds: string[] | undefined,
	latest: boolean,
	currency: string | undefined,
	idSelector: (assetItem: AssetItem) => string
) {
	const primalApiClient = usePrimalApiClient();
	assetItemIds = (assetItemIds || []).sort();
	assetItems = assetItems || [];

	const queryInputs = getQueryInputs(
		assetItems,
		assetItemIds,
		latest,
		idSelector
	);

	return useQueries({
		queries: queryInputs.map(({ id, assetItemIds, date }) => ({
			queryKey: [
				'valuation',
				{
					date,
					assetItemIds,
					currency,
				},
			],
			queryFn: async () => {
				const response = await primalApiClient.get(
					`valuation?${assetItemIds
						.map((id) => `assetItemId=${id}`)
						.join('&')}&date=${date}&currency=${currency}`
				);
				return response.data as Valuation;
			},
			enabled: !!currency && assetItemIds.length > 0 && assetItems.length > 0,
			select: (data: Valuation) =>
				({
					...data,
					id,
					date,
				} as Valuation),
		})),
	});
}

function getQueryInputs(
	assetItems: AssetItem[],
	assetItemIds: string[],
	latest: boolean,
	idSelector: (assetItem: AssetItem) => string
): { id: string; assetItemIds: string[]; date: string }[] {
	const idToAssetItemIds = new Map<string, string[]>();

	for (const assetItemId of assetItemIds) {
		const assetItem = assetItems.find((x) => x.id === assetItemId)!;

		const id = idSelector(assetItem);

		if (!idToAssetItemIds.has(id)) {
			idToAssetItemIds.set(id, []);
		}

		idToAssetItemIds.get(id)!.push(assetItemId);
	}

	const dates = getQueryDates(assetItems, assetItemIds, latest);

	return Array.from(idToAssetItemIds.entries()).flatMap(([id, assetItemIds]) =>
		dates.map((date) => ({
			id,
			assetItemIds,
			date,
		}))
	);
}

function getQueryDates(
	assetItems: AssetItem[],
	assetItemIds: string[],
	latest: boolean
): string[] {
	const dates = [DateTime.now().toISODate()];

	if (!latest) {
		const earliestDate = DateTime.fromISO(
			assetItems
				.filter((x) => assetItemIds.includes(x.id))
				.filter((x) => x.firstTransactionDate)
				.reduce(
					(acc, x) =>
						x.firstTransactionDate! < acc ? x.firstTransactionDate! : acc,
					dates[0]
				)
		);

		let date = DateTime.now().set({ month: 3, day: 31 }); // Set to the nearest March
		if (date > DateTime.now()) {
			date = date.minus({ years: 1 }); // Move to the previous March if the current date is past March
		}

		while (date >= earliestDate) {
			dates.push(date.toISODate());
			date = date.minus({ years: 1 }); // Move back yearwise
		}
	}

	return dates;
}
