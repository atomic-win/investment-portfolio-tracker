import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Transaction } from '@/features/lib/types';
import { useAssetItemTransactionsQueries } from '@/features/assetItems/hooks/transactions';

export default function withTransactions<
	T extends { transactions: Transaction[] }
>(Component: React.ComponentType<T>) {
	return function WithTransactions(
		props: Omit<T, 'transactions'> & {
			currency: string;
			assetItemIds: string[];
		}
	) {
		const transactionsResults = useAssetItemTransactionsQueries(
			props.currency,
			props.assetItemIds
		);

		if (transactionsResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching transactions' />;
		}

		if (transactionsResults.some((result) => result.isError)) {
			return (
				<ErrorComponent errorMessage='Failed while fetching transactions' />
			);
		}

		return (
			<Component
				{...(props as unknown as T)}
				transactions={transactionsResults.flatMap((x) => x.data!)}
			/>
		);
	};
}
