import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

import { refreshAssetItem } from '@/features/assetItems/hooks/assetItems';
import {
	AddTransactionRequest,
	EditTransactionRequest,
} from '@/features/assetItems/schema';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Transaction } from '@/types';

export function useAssetItemTransactionsQuery(
	assetItemId: string,
	currency: string | undefined
) {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
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
	});
}

export function useTransactionQuery(
	assetItemId: string,
	transactionId: string,
	currency: string | undefined
) {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: [
			'assetitems',
			assetItemId,
			'transactions',
			transactionId,
			{
				currency,
			},
		],
		queryFn: async () => {
			const response = await primalApiClient.get(
				`assetitems/${assetItemId}/transactions/${transactionId}?currency=${currency}`
			);
			return response.data as Transaction;
		},
		enabled: !!currency && !!assetItemId && !!transactionId,
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
		onSuccess: async (_data, variables) =>
			await refreshAssetItem(queryClient, variables),
	});
}

export function useEditTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (request: EditTransactionRequest) => {
			console.log('Editing transaction with data :', request);
			await primalApiClient.put(
				`assetitems/${request.assetItemId}/transactions/${request.transactionId}`,
				_.omit(request, ['assetItemId', 'transactionId'])
			);
		},
		onSuccess: async (_data, variables) =>
			await refreshAssetItem(queryClient, variables),
	});
}

export function useDeleteTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (request: {
			assetItemId: string;
			transactionId: string;
			date: Date;
		}) => {
			await primalApiClient.delete(
				`assetitems/${request.assetItemId}/transactions/${request.transactionId}`
			);
		},
		onSuccess: async (_data, variables) =>
			await refreshAssetItem(queryClient, variables),
	});
}
