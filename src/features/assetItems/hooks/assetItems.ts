import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AssetItem } from '@/features/lib/types';

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

export function useDeleteAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetItemId: string) => {
			await primalApiClient.delete(`assetitems/${assetItemId}`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['assetitems', 'all'],
			});
		},
	});
}
