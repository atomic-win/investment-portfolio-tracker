import {
	Query,
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { AddAssetItemRequest } from '@/features/assetItems/schema';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { AssetItem } from '@/types';

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
		onSuccess: async (_data, assetItemId) => {
			queryClient.removeQueries({
				predicate: (query) => isQueryRelatedToAssetItem(query, { assetItemId }),
			});

			await refreshAssetItems(queryClient);
		},
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
		predicate: (query) => isQueryRelatedToAssetItem(query, request),
	});
}

function isQueryRelatedToAssetItem(
	query: Query<unknown, Error, unknown, readonly unknown[]>,
	request: { assetItemId: string; date?: Date | undefined }
) {
	if (query.queryKey[0] !== 'assetitems' && query.queryKey[0] !== 'valuation') {
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
			valuationQueryData.date >= DateTime.fromJSDate(request.date).toISODate()!)
	);
}
