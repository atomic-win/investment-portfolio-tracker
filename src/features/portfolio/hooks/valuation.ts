import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQueries } from '@tanstack/react-query';
import { AssetItem, Transaction, Valuation } from '@/types';
import { DateTime } from 'luxon';

export default function useValuationQueries(
	currency: string | undefined,
	assetItemIds: string[] | undefined,
	assetItems: AssetItem[],
	transactions: Transaction[],
	idSelector: (assetItem: AssetItem) => string,
	latest: boolean
) {
	const primalApiClient = usePrimalApiClient();
	assetItemIds = (assetItemIds || []).sort();
	assetItems = assetItems || [];

	const queryInputs = getQueryInputs(
		assetItemIds,
		assetItems,
		transactions,
		idSelector,
		latest
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
	assetItemIds: string[],
	assetItems: AssetItem[],
	transactions: Transaction[],
	idSelector: (assetItem: AssetItem) => string,
	latest: boolean
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

	const dates = getQueryDates(assetItemIds, transactions, latest);

	return Array.from(idToAssetItemIds.entries()).flatMap(([id, assetItemIds]) =>
		dates.map((date) => ({
			id,
			assetItemIds,
			date,
		}))
	);
}

function getQueryDates(
	assetItemIds: string[],
	transactions: Transaction[],
	latest: boolean
): string[] {
	const dates = [DateTime.now().toISODate()];

	if (!latest) {
		const earliestDate = DateTime.fromISO(
			transactions
				.filter((x) => assetItemIds.includes(x.assetItemId))
				.reduce((acc, x) => (x.date < acc ? x.date : acc), dates[0])
		);

		let date = DateTime.now().minus({ months: 1 }).endOf('month');
		while (date >= earliestDate) {
			dates.push(date.toISODate());
			date = date.minus({ months: 1 }).endOf('month');
		}
	}

	return dates;
}
