import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import {
	QueryClient,
	useMutation,
	useQueries,
	useQueryClient,
} from '@tanstack/react-query';
import { Transaction } from '@/features/lib/types';
import { TransactionType } from '@/types';

export type AddTransactionRequest = {
	date: string;
	name: string;
	type: TransactionType;
	assetItemId: string;
	units: number;
};

export type DeleteTransactionRequest = {
	assetItemId: string;
	transactionId: string;
	date: string;
};

export function useAssetItemTransactionsQueries(
	currency: string | undefined,
	assetItemIds: string[] | undefined
) {
	const primalApiClient = usePrimalApiClient();

	return useQueries({
		queries: (assetItemIds || []).map((assetItemId) => ({
			queryKey: [
				'assetitems',
				assetItemId,
				'transactions',
				{
					currency,
				},
			],
			queryFn: async () => {
				const response = await primalApiClient.get(
					`assetitems/${assetItemId}/transactions?currency=${currency}`
				);
				const transactions = response.data as Transaction[];
				return transactions.sort((a, b) => b.date.localeCompare(a.date));
			},
			select: (data: Transaction[]) =>
				data.map((x) => ({
					...x,
					assetItemId,
				})),
			enabled: !!currency && !!assetItemId,
		})),
	});
}

export function useDeleteTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (request: DeleteTransactionRequest) => {
			await primalApiClient.delete(
				`assetitems/${request.assetItemId}/transactions/${request.transactionId}`
			);
		},
		onSettled: (_data, _error, request) => onSettled(queryClient, request),
	});
}

export function useAddTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (transaction: AddTransactionRequest) => {
			await primalApiClient.post(
				`assetitems/${transaction.assetItemId}/transactions`,
				transaction
			);
		},
		onSettled: (_data, _error, request) => onSettled(queryClient, request),
	});
}

function onSettled(
	queryClient: QueryClient,
	request: DeleteTransactionRequest | AddTransactionRequest
) {
	queryClient.invalidateQueries({
		predicate: (query) => {
			if (
				query.queryKey[0] !== 'investments' ||
				query.queryKey[1] !== 'assets'
			) {
				return false;
			}

			if (
				query.queryKey[2] === request.assetItemId &&
				query.queryKey[3] === 'transactions'
			) {
				return true;
			}

			if (query.queryKey[2] !== 'valuation') {
				return false;
			}

			const valuationQueryData = query.queryKey[3] as {
				assetIds: string[];
				date: string;
			};

			return (
				valuationQueryData.assetIds.includes(request.assetItemId) &&
				valuationQueryData.date >= request.date
			);
		},
	});
}
