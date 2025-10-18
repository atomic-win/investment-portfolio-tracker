'use client';
import withCurrency from '@/components/hoc/withCurrency';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import { AssetItemPortfolio } from '@/types';
import EditTransactionForm from './EditTransactionForm';
import { useTransactionQuery } from '../hooks/transactions';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';

export default function Page({
	assetItemId,
	transactionId,
}: {
	assetItemId: string;
	transactionId: string;
}) {
	const WithEditTransactionFormWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(PageComponent))
	);

	return (
		<WithEditTransactionFormWrapper
			assetItemIds={[assetItemId]}
			latest={true}
			transactionId={transactionId}
		/>
	);
}

function PageComponent({
	portfolios,
	transactionId,
}: {
	portfolios: AssetItemPortfolio[];
	transactionId: string;
}) {
	const assetItem = portfolios[0];

	const {
		data: transaction,
		isLoading,
		isError,
	} = useTransactionQuery(assetItem.id, transactionId, assetItem.currency);

	if (isLoading) {
		return <LoadingComponent loadingMessage='Fetching transaction' />;
	}

	if (isError || !transaction) {
		return <ErrorComponent errorMessage='Failed while fetching transaction' />;
	}

	return (
		<>
			<title>Edit Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.name, href: `/assetitems/${assetItem.id}` },
					{
						title: 'Edit Transaction',
						href: `/assetitems/${assetItem.id}/transactions/edit`,
					},
				]}
			/>
			<div className='container mx-auto p-2 h-full'>
				<Card className='p-8 max-w-screen-sm mx-auto'>
					<EditTransactionForm
						assetItem={assetItem}
						transaction={transaction}
					/>
				</Card>
			</div>
		</>
	);
}
