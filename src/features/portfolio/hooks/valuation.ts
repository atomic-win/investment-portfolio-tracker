import { useQueries } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { AssetItem, Valuation } from '@/types';

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
					`assetItems/valuation?${assetItemIds
						.map((id) => `assetItemIds=${id}`)
						.join('&')}&date=${date}&currency=${currency}`
				);
				return response.data as Valuation;
			},
			enabled:
				!!currency && assetItemIds.length > 0 && assetItems.length > 0,
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

	return Array.from(idToAssetItemIds.entries()).flatMap(
		([id, assetItemIds]) =>
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
	let monthEndDate = DateTime.now()
		.startOf('month')
		.minus({ months: 1 })
		.endOf('month');

	if (latest) {
		return [monthEndDate.toISODate()!];
	}

	const earliestDate = DateTime.fromISO(
		assetItems
			.filter((x) => assetItemIds.includes(x.id))
			.filter((x) => x.activityStartDate)
			.reduce(
				(acc, x) =>
					x.activityStartDate! < acc ? x.activityStartDate! : acc,
				monthEndDate.toISODate()!
			)
	);

	const dates: string[] = [];

	while (monthEndDate >= earliestDate) {
		dates.push(monthEndDate.toISODate()!);
		monthEndDate = monthEndDate
			.startOf('month')
			.minus({ months: 1 })
			.endOf('month');
	}

	return dates;
}
