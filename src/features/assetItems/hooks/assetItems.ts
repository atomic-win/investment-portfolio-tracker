import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { AssetItem } from '@/types';
import { AddAssetItemRequest } from '@/features/assetItems/schema';
import { DateTime } from 'luxon';

export function useAllAssetItemsQuery() {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['assetitems', 'all'],
		queryFn: async () => {
			const response = await primalApiClient.get('assetitems');
			return response.data as AssetItem[];
		},
	});
}

export function useAddAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetItem: AddAssetItemRequest) => {
			await primalApiClient.post('assetitems', assetItem);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['assetitems', 'all'],
			});
		},
	});
}

export function useDeleteAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetItemId: string) => {
			await primalApiClient.delete(`assetitems/${assetItemId}`);
		},
		onSettled: async () => await refreshAssetItems(queryClient),
	});
}

export async function refreshAssetItems(queryClient: QueryClient) {
	return await queryClient.invalidateQueries({
		predicate: (query) =>
			query.queryKey[0] === 'assetitems' || query.queryKey[0] === 'valuation',
	});
}

export async function refreshAssetItem(
	queryClient: QueryClient,
	request: {
		assetItemId: string;
		date?: Date | undefined;
	}
) {
	return await queryClient.invalidateQueries({
		predicate: (query) => {
			if (
				query.queryKey[0] !== 'assetitems' &&
				query.queryKey[0] !== 'valuation'
			) {
				return false;
			}

			if (
				query.queryKey[1] === request.assetItemId &&
				query.queryKey[2] === 'transactions'
			) {
				return true;
			}

			if (query.queryKey[0] !== 'valuation') {
				return false;
			}

			const valuationQueryData = query.queryKey[1] as {
				assetItemIds: string[];
				date: string;
			};

			return (
				valuationQueryData.assetItemIds.includes(request.assetItemId) &&
				(request.date === undefined ||
					valuationQueryData.date >=
						DateTime.fromJSDate(request.date).toISODate()!)
			);
		},
	});
}
